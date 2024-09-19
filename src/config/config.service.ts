import { Injectable } from '@nestjs/common';
import * as fs from 'fs'
import {parse} from 'dotenv'


@Injectable()
export class ConfigService {
    private readonly envConfig: {[key:string]:string}

    constructor(){
        const isDevelopmentDev=process.env.NODE_ENV !== 'production'
        if(isDevelopmentDev){
            const envFilePath= __dirname+'/../../.env.development'
            const existsPath=fs.existsSync(envFilePath)
            if(!existsPath){
                console.log('.en.development no existe DEVELOPMENT')
                process.exit(1)
            }
            this.envConfig=parse(fs.readFileSync(envFilePath))
        }
        else{
            const envFilePath= __dirname+'/../../.env.production'
            const existsPath=fs.existsSync(envFilePath)
            if(!existsPath){
                console.log('.en.production no existe PRODUCTION')
                process.exit(1)
            }
            this.envConfig=parse(fs.readFileSync(envFilePath))
        }
    }
    get (key:string):string{
        return this.envConfig[key]
    }
}
