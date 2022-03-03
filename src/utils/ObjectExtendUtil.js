class ObjectExtendUtil{
 static extend(toThisInstance,fromThisConstructor){
   fromThisConstructor.call(toThisInstance);
  let c = toThisInstance.constructor;
   Object.assign(toThisInstance, fromThisConstructor.prototype);
   toThisInstance.constructor = c;
   
  
 }
}
module.exports =  ObjectExtendUtil;