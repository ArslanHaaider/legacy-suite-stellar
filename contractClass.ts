import { Address, Contract,contract} from '@stellar/stellar-sdk'; 
import { i128 } from './packages/legacy/src';
// import { Benificary } from './packages/legacy';
const { Spec }  = contract

 interface Benificary {
  benificary: Address;
  token: Address;
  value: i128;
}
type Spec = any;
export class legacyContract extends Contract {
  spec: Spec;

  constructor(address: string) {
    super(address);
    this.spec = new Spec(["AAAAAQAAAAAAAAAAAAAACkJlbmlmaWNhcnkAAAAAAAMAAAAAAAAACmJlbmlmaWNhcnkAAAAAABMAAAAAAAAABXRva2VuAAAAAAAAEwAAAAAAAAAFdmFsdWUAAAAAAAAL",
    "AAAAAQAAAAAAAAAAAAAABWFkbWluAAAAAAAAAQAAAAAAAAAGYWRtaW5zAAAAAAPqAAAD7gAAACA=",
    "AAAAAQAAAAAAAAAAAAAABVBhcmFtAAAAAAAAAwAAAAAAAAAKYmVuaWZpY2FyeQAAAAAAEwAAAAAAAAAFdG9rZW4AAAAAAAATAAAAAAAAAAV2YWx1ZQAAAAAAAAs=",
    "AAAAAAAAAAAAAAAJYWRkX2FkbWluAAAAAAAAAQAAAAAAAAAMYWRtaW5fYWRyZXNzAAAD7gAAACAAAAAA",
    "AAAAAAAAAAAAAAASYWRkX211bHRpcGxlX2Fzc2V0AAAAAAACAAAAAAAAAARkYXRhAAAD6gAAB9AAAAAKQmVuaWZpY2FyeQAAAAAAAAAAAARmcm9tAAAAEwAAAAA=",
    "AAAAAAAAAAAAAAALY2xhaW1fYXNzZXQAAAAABQAAAAAAAAAEZnJvbQAAABMAAAAAAAAAB2NsYWltZXIAAAAAEwAAAAAAAAAHbWVzc2FnZQAAAAAOAAAAAAAAAAdhZGRyZXNzAAAAA+4AAAAgAAAAAAAAAAlzaWduYXR1cmUAAAAAAAPuAAAAQAAAAAA=",
    "AAAAAAAAAAAAAAAPdGVzdF9hZG1pbl9zaWduAAAAAAAAAAABAAAAAQ==",
    "AAAAAAAAAAAAAAAKcGFyYW1fdGVzdAAAAAAAAQAAAAAAAAAEZnJvbQAAABMAAAABAAAAAQ=="]);
  }
  public param_test(from:Address) {
    const invokeArgs = this.spec.funcArgsToScVals('param_test', {
      from:from
    });
    const operation = this.call('param_test', ...invokeArgs);
    return operation;
  }
  public add_multiple(data:Array<Benificary>,from:Address){
    const invokeArgs = this.spec.funcArgsToScVals('add_multiple_asset',{
        data:data,
        from:from
    })
    const operation = this.call('add_multiple_asset',...invokeArgs);
    return operation;

  }
  public claim_asset(  
    from: Address,
    claimer: Address,
    message:Uint8Array,
    address:Uint8Array,
    signature:Uint8Array){
    const invokeArgs = this.spec.funcArgsToScVals('claim_asset',{
      from:from,
      claimer:claimer,
      message:message,
      address:address,
      signature:signature
    })
    console.log(invokeArgs);
    const operation = this.call('claim_asset',...invokeArgs);
    return operation
    }

  public add_admin(admin_adress: Uint8Array){
    const invokeArgs = this.spec.funcArgsToScVals('add_admin',{
      admin_adress:admin_adress
  })
  const operation = this.call('add_admin',...invokeArgs);
  return operation;

  }
}