const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Sequelize = require('sequelize');
const { STRING, UUID, UUIDV4, DATE, ENUM } = Sequelize;

if(process.env.LOGGING){
  delete config.logging;
}
const conn = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/stackathon', {logging: false});

const User = conn.define('user', {
  id: {
    primaryKey: true,
    type: UUID,
    defaultValue: UUIDV4
  },
  firstName: {
    type: STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  lastName: {
    type: STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  email: {
    type: STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true,
      isEmail: true
    }
  },
  password: {
    type: STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  // cdcCard: {
  //   type: STRING
  // },
  profilePhoto: {
    type: STRING
  }
},
{
  timestamps: false
}
);

const Vaccine = conn.define('vaccine', {
  name: {
    type: ENUM(['Pfizer', 'Moderna', 'J&J']),
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  firstDose: {
    type: STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  secondDose: {
    type: STRING,
    defaultValue: null
  },
  cdcCard: {
    type: STRING
  },
}, 
{
  timestamps: false
}
)

User.addHook('beforeSave', async function(user) {
    if(user._changed.has('password')) {
        user.password = await bcrypt.hash(user.password, 5)
    }
});

User.byToken = async(token)=> {
  try {
    console.log("byToken ran token = ", token)
    const payload = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    console.log("payload?", payload)
    const user = await User.findByPk(
      payload,
      {
        include: [Vaccine]
      }
    );
    console.log("ACHEI", user)
    if(user){
      console.log("if", user)
      return {user};
    }
    const error = Error('bad credentials');
    error.status = 401;
    throw error;
  }
  catch(ex){
    const error = Error('bad credentials');
    error.status = 401;
    throw error;
  }
};

User.authenticate = async(email, password)=> {
    console.log("email?", email)
    console.log("password", password)
    const user = await User.findOne({
        where: {
        email
        }
    });
    console.log("hello user", user)
    const correct = user && await bcrypt.compare(password, user.password);
    console.log("hello", correct)

    if (correct) {
        console.log("authenticate ran, id = ", user.id)
        console.log("JWT? why is this not working?", process.env.JWT)
        const token = await jwt.sign(user.id, process.env.ACCESS_TOKEN_SECRET)
        console.log("token created?", token)
        return token
  } else {
    const error = Error('bad credentials');
    error.status = 401;
    return 'ta errado';
  }
};

Vaccine.belongsTo(User);
User.hasOne(Vaccine);

const syncAndSeed = async()=> {
  await conn.sync({ force: true });
  const credentials = [
    { firstName: 'Lucy', lastName: 'Ricardo', password: 'lucy_pw', email: 'lucy@tvland.com'},
    { firstName: 'Moe', lastName: 'Stooge', password: 'moe_pw', email: 'moe@tvland.com'},
    { firstName: 'Larry', lastName: 'Stooge', password: 'larry_pw', email: 'larry@tvland.com'},
    { firstName: 'Sheldon', lastName: 'Cooper', password: 'bazinga', email: 'sheldon@bazinga.biz'}
  ];
  const [lucy, moe, larry] = await Promise.all(
    credentials.map( credential => User.create(credential))
  );

  return {
    users: {
      lucy,
      moe,
      larry
    }
  };
};

module.exports = {
  syncAndSeed,
  models: {
    User,
    Vaccine
  }
};