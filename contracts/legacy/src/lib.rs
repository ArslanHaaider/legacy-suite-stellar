#![no_std]

use soroban_sdk::{
    contract, contractimpl, contracttype, log, symbol_short, token, vec, xdr::{ScAddress, ScVal, Value}, Address, Bytes, BytesN, Env, Map, String, Symbol, Val, Vec
};
const ADMIN: Symbol = symbol_short!("ADMIN");
#[contract]
pub struct Legacy;

#[contracttype]
pub struct Benificary {
  pub  token: Address,
  pub  benificary: Address,
  pub  value: i128,
}
#[contracttype]
pub struct admin {
    admins: Vec<BytesN<32>>,
}
#[contracttype]
pub struct Param{
    token: Address,
    benificary: Address,
    value: i128,
}
pub fn add_asset(
    env: Env,
    token_address: Address,
    from: Address,
    benificary: Address,
    amount: i128,
) {
    let client = token::Client::new(&env, &token_address);
    let balance = client.balance(&from);
    if balance > amount {
        let event = env.events();
        let topic = ("transfer", &from, &env.current_contract_address());
        client.transfer(&from, &env.current_contract_address(), &amount);
        event.publish(topic, amount);
    } else {
        panic!("no enough amount present")
    }
    //creating default map in case not a new benificiary where key is benificary address
    let default_map: Map<Address, Vec<(Address, i128)>> = Map::new(&env);
    //fetching the will map which has all the information regard to benificiary
    let mut will_map: Map<Address, Vec<(Address, i128)>> =
        env.storage().persistent().get(&from).unwrap_or(default_map);
    //getting curruent information about the benificiary and allowed assets
    let mut benificary_assets = will_map.get(benificary.clone()).unwrap_or(vec![&env]);
    //specifying the amount for that token for curruent benificary
    benificary_assets.append(&vec![&env, (token_address, amount)]);
    //adding the information to will map
    will_map.set(benificary, benificary_assets);
    //adding the new benificary and its asset to contract storage
    env.storage().persistent().set(&from, &will_map);
}

#[contractimpl]
impl Legacy {
    pub fn add_admin(env: Env, admin_adress: BytesN<32>) {
        let copy_admin: BytesN<32> = admin_adress.clone();
        let mut admin_list: admin = env.storage().persistent().get(&ADMIN).unwrap_or({
            admin {
                admins: vec![&env, admin_adress],
            }
        });
        let new_admin: Vec<BytesN<32>> = vec![&env, copy_admin];
        admin_list.admins.append(&new_admin);
        env.storage().persistent().set(&ADMIN, &admin_list);
    }

    pub fn add_multiple_asset(env: Env, data: Vec<Benificary>, from: Address){
        from.require_auth();
        for benificary in data {
            let token_address = benificary.token;
            let amount = benificary.value;
            let benificary_address = benificary.benificary;
            add_asset(
                env.clone(),
                token_address,
                from.clone(),
                benificary_address,
                amount,
            );
        }
    }
    pub fn claim_asset(
        env: Env,
        from: Address,
        claimer: Address,
        message: Bytes,
        address: BytesN<32>,
        signature: BytesN<64>,
    ) {
        claimer.require_auth();
        let admins_list = env
            .storage()
            .persistent()
            .get(&ADMIN)
            .unwrap_or(admin { admins: vec![&env] });
        //first verifies the admin signatures
        env.crypto().ed25519_verify(&address, &message, &signature);
        //than we will see if this is even a admin or not!
        admins_list.admins.contains(&address);
        if env.storage().persistent().has(&from) {
            let default_map: Map<Address, Vec<(Address, i128)>> = Map::new(&env);
            //fetching the will map which has all the information regard to benificiary
            let mut will_map: Map<Address, Vec<(Address, i128)>> =
                env.storage().persistent().get(&from).unwrap_or(default_map);
            // //find out if claimer is the benificary or not
            assert_eq!(will_map.contains_key(claimer.clone()), true);
            // //getting curruent information about the benificiary and allowed assets
            let mut benificary_assets: Vec<(Address, i128)> =
                will_map.get(claimer.clone()).unwrap_or(vec![&env]);
            //will run a loop over all assets assingeed to the
            for assets in benificary_assets {
                let (token_Addresss, amount) = assets;
                let event = env.events();
                let topic = ("transfer", &env.current_contract_address(), &claimer);
                let client = token::Client::new(&env, &token_Addresss);
                client.transfer(&env.current_contract_address(), &claimer, &amount);
                event.publish(topic, amount);
            }
            will_map.remove(claimer);
            env.storage().persistent().set(&from, &will_map);
        } else {
            // Err(Error::NO_WILL_EXIST)
        }
    }
    //to mimic the signiing of the signature
    pub fn test_admin_sign(env: Env) -> bool {
        true
    }
    //just to test the issue I'm currently facing with calling client sided bindings
    pub fn param_test(env:Env,from:Address)-> bool{
        true
    }   
}
mod test;
