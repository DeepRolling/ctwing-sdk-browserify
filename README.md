# Purpose
Offer ctwing sdk for browser or react-native enviorment

inspired by [ctwing-sdk](https://github.com/c-tsy/ctwing) but change the crypto library and query-params
libarary implementation . 

# Installation
```bash
yarn add ctwing-sdk-browserify
```

# Usage
```typescript
import {CommandOperate, injectCTWingConfiguration} from '@deepcode/ctwing-sdk-browserify';
//you need inject your appKey and appSecret first ( create an application in ctwing platform and you will find them)
injectCTWingConfiguration(appKey, appSecret);
let commandOperate = new CommandOperate(productId, masterKey, deviceId);
//you always need to send json data , and different protocol(mqtt or t-link) have different message format
//following is mqtt message format
const mqttMessage = {
    payload: {
        status: 1,
        temperature: 26,
    },
}
//dispatch message to device
await commandOperate.sendJSON(mqttMessage);
```

# Limitation

For these sdk implementation , I only use dispatch device command functionality , 
so that I can't ensure other functionality of this library work correctly . 

But you also can modify it by your self , I already split the code to multiple file
so that the code should be read easily . 

In the end , **Welcome PR to perfect this library** .