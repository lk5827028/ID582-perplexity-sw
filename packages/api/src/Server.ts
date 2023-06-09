import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import path from 'path'
import helmet from 'helmet'

import express, { NextFunction, Request, Response } from 'express'
import StatusCodes from 'http-status-codes'
import 'express-async-errors'

import BaseRouter from './routes'

const app = express()
const { BAD_REQUEST } = StatusCodes

/************************************************************************************
 *                              Set basic express settings
 ***********************************************************************************/

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// Show routes called in console during development
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

// Security
if (process.env.NODE_ENV === 'prod') {
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", '*.google.com', '*.gstatic.com'],
        frameSrc: ['*.google.com'],
        styleSrc: ["'self'", 'https:', "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:'],
        fontSrc: ["'self'", 'https:', 'data:']
      }
    }
  }))
}

// Add APIs
app.use('/api', BaseRouter)

// Print API errors
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err, true)
  return res.status(BAD_REQUEST).json({
    error: err.message
  })
})

/************************************************************************************
 *                              Serve front-end content
 ***********************************************************************************/

// const viewsDir = path.join(__dirname, 'views')
// app.set('views', viewsDir)
const staticDir = process.env.NODE_ENV === 'development' ? path.join(__dirname, 'public') : path.join(__dirname, '../../../../web/build')
console.log('static dir: ', staticDir)
app.use(express.static(staticDir))
app.get('*', (req: Request, res: Response) => {
  res.sendFile('index.html', { root: staticDir })
})

// Export express instance
export default app
