const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const { Pool } = require('pg')

const pgConfig = require('./config/config.json')[process.env.NODE_ENV]
const DevUtils = require('./utils/dev-utils')
const ErrorUtils = require('./utils/error-utils')

const app = express()

const router = express.Router()

const port = process.env.PORT || 3000

const dbConfig = DevUtils.getPoolParameters(pgConfig)

const pool = new Pool({
  ...dbConfig,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

const corsOptions = {
  origin: process.env.FE_URL,
  optionsSuccessStatus: 200,
  allowedHeaders: [
    'Authorization',
    'Access-Control-Allow-Credentials',
    'Content-Type',
  ],
  exposedHeaders: [
    'X-User-Verified',
  ],
  credentials: true,
}

const users = require('./routes/users')
const activities = require('./routes/activities')
const roles = require('./routes/roles')
const portionHealthinesses = require('./routes/portion-healthinesses')
const portionSizes = require('./routes/portion-sizes')
const portions = require('./routes/portions')
const registration = require('./routes/registration')

const { User, Role } = require('./models')

const ApiUtils = require('./utils/api-utils')

app.use(bodyParser.json())

if (DevUtils.isDevelopment()) {
  app.use(cors(corsOptions))
}

app.set('view engine', 'html')
app.use(express.static(path.join(__dirname, '/public')))
app.use(cookieParser())
app.use(session({
  name: 'portion-tracker',
  store: new (require('connect-pg-simple')(session))({
    pool,
    tableName: 'Sessions',
  }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 },
  saveUninitialized: false,
  secure: true,
}))

router.use('/users', ApiUtils.authorize, ApiUtils.verifyUser, users)
router.use('/activities', ApiUtils.authorize, ApiUtils.verifyUser, activities)
router.use('/roles', ApiUtils.authorize, ApiUtils.verifyUser, roles)
router.use('/portion_healthinesses', ApiUtils.authorize, ApiUtils.verifyUser, portionHealthinesses)
router.use('/portion_sizes', ApiUtils.authorize, ApiUtils.verifyUser, portionSizes)
router.use('/portions', ApiUtils.authorize, ApiUtils.verifyUser, portions)
router.use('/registration', registration)

app.use('/api', router)

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

app.post('/login', ApiUtils.wrapAsync(async (req, res, next) => {
  const { email, password } = req.body

  const user = await User.findOne({
    where: { email },
    include: [ Role ],
  })

  if (!user) {
    next(ErrorUtils.createResourceNotFoundError('User not found.'))
  }

  await user.authenticate(password).then((user) => {
    req.session.user = user.toJSON()
    req.session.save((err) => {
      if (err) {
        next(err)
      }

      ApiUtils.validResponse(user, res)
    })
  })
}))

app.post('/logout', ApiUtils.wrapAsync((req, res) => {
  req.session.destroy()
  res.clearCookie('portion-tracker')

  ApiUtils.validResponse({ message: 'ok' }, res)
}))

app.use(ApiUtils.catchError)

app.listen(port, () => {
  console.info(`App is listening on port ${port}`)
})
