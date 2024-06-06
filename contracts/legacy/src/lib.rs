#![no_std]



use soroban_sdk::{
    contract, contractimpl, contracttype, symbol_short, token, vec, Address, Bytes, BytesN, Env, Map, Symbol, Vec};




const ADMIN: Symbol = symbol_short!("ADMIN");
const BENI: Symbol = symbol_short!("BENI");

#[contract]

pub struct Legacy;

#[contracttype]
pub struct Benificary {
    pub token: Address,
    pub benificary: Address,
    pub value: i128,
}

#[contracttype]
pub struct BenificaryStorage{
    pub token: Address,
    pub benificary: Address,
    pub value: i128,
    pub claimed:bool,
}
#[contracttype]
pub struct Admin {
    admins: Vec<BytesN<32>>,
}
#[contracttype]
pub struct Asset{
    token: Address,
    from: Address,
    value: i128,
    claimed: bool,
}

pub fn add_asset(
    env: Env,
    token_address: Address,
    from: Address,
    benificary: Address,
    amount: i128,
) {
    let claimed = false;
    let client = token::Client::new(&env, &token_address);
    let event = env.events();
    let topic = ("testament", &from, &benificary, claimed);
    client.transfer(&from, &env.current_contract_address(), &amount);
    event.publish(topic, amount);

    let default_map: Map<Address, Vec<BenificaryStorage>> = Map::new(&env);
    let default_asset:  Map<Address,Vec<(Address,Address,i128,bool)>> = Map::new(&env);
    let default_asset_array:Vec<(Address,Address,i128,bool)> = Vec::new(&env);
    let mut will_map: Map<Address, Vec<BenificaryStorage>> = env.storage().persistent().get(&from).unwrap_or(default_map);
    let mut asset_map: Map<Address,Vec<(Address,Address,i128,bool)>> = env
        .storage()
        .persistent()
        .get(&BENI)
        .unwrap_or(default_asset);

    let mut benificary_assets: Vec<BenificaryStorage> = will_map.get(benificary.clone()).unwrap_or(vec![&env]);

    // let mut found = false;
    // for (i, (prevToken, prevAmount, prevClaimed)) in benificary_assets.iter().enumerate() {
    //     if prevToken == token_address {
    //         benificary_assets.set(i as u32, (prevToken, prevAmount + amount, false));
    //         found = true;
    //         break;
    //     }
    // }

    // if !found {

        let beneficiary_struct = BenificaryStorage{token:token_address.clone(),benificary:benificary.clone(),value:amount,claimed:false};

        benificary_assets.append(&vec![&env, beneficiary_struct]);
        
        let mut asset_array: Vec<(Address, Address, i128, bool)> =  asset_map.get(
            benificary.clone()).unwrap_or(default_asset_array);
        asset_array.append(&vec![&env,(token_address.clone(),from.clone(),amount,claimed)]);




    will_map.set(benificary.clone(), benificary_assets);
    asset_map.set(benificary, asset_array.clone());
    env.storage().persistent().set(&from, &will_map);
    env.storage().persistent().set(&BENI, &asset_map);

}
    
#[contractimpl]
impl Legacy {
    pub fn add_admin(env: Env, admin_adress: BytesN<32>) {
        let copy_admin: BytesN<32> = admin_adress.clone();
        let mut admin_list: Admin = env.storage().persistent().get(&ADMIN).unwrap_or({
            Admin {
                admins: vec![&env, admin_adress],
            }
        });
        let new_admin: Vec<BytesN<32>> = vec![&env, copy_admin];
        admin_list.admins.append(&new_admin);
        env.storage().persistent().set(&ADMIN, &admin_list);
    }

    pub fn add_multiple_asset(env: Env, data: Vec<Benificary>, from: Address) {
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
            .unwrap_or(Admin { admins: vec![&env] });
        //first verifies the admin signatures
        env.crypto().ed25519_verify(&address, &message, &signature);
        //than we will see if this is even a admin or not!
        admins_list.admins.contains(&address);
        if env.storage().persistent().has(&from) {
            let default_map: Map<Address, Vec<BenificaryStorage>> = Map::new(&env);
            let default_asset:  Map<Address,Vec<(Address,Address,i128,bool)>> = Map::new(&env);
            let default_asset_array:Vec<(Address,Address,i128,bool)> = Vec::new(&env);
            //fetching the will map which has all the information regard to benificiary
            let mut will_map: Map<Address, Vec<BenificaryStorage>> =
                env.storage().persistent().get(&from).unwrap_or(default_map);

            // //find out if claimer is the benificary or not
            assert_eq!(will_map.contains_key(claimer.clone()), true);
            // //getting curruent information about the benificiary and allowed assets
            let mut benificary_assets: Vec<BenificaryStorage> =
                will_map.get(claimer.clone()).unwrap_or(vec![&env]);
            //getting benificiary asset for storage purposes stored with key as claimer address:
            let mut asset_map:  Map<Address,Vec<(Address,Address,i128,bool)>>= 
            env.storage().persistent().get(&BENI).unwrap_or(default_asset);
  

            let mut asset_array =  asset_map.get(
                claimer.clone()).unwrap_or(default_asset_array);
            // will run a loop over all assets assingeed to the
            for asset in benificary_assets.clone() {
                let token_Address = asset.token;
                let amount= asset.value;
                let claimed = asset.claimed;
                let benificiary_Address = asset.benificary;
                let event = env.events();
                let index =  benificary_assets.first_index_of(BenificaryStorage{
                    benificary:benificiary_Address.clone(),
                    token:token_Address.clone(),
                    claimed:claimed,
                    value:amount
                });
                let index_value: u32 = index.unwrap_or(0);
                benificary_assets.set(index_value, (BenificaryStorage{
                    benificary:benificiary_Address.clone(),
                    token:token_Address.clone(),
                    claimed:true,
                    value:amount
                }));
                let client = token::Client::new(&env, &token_Address);
                if !claimed{
                    client.transfer(&env.current_contract_address(), &claimer, &amount);
                    let topic = ("testament", &from, &claimer, true);
                    event.publish(topic, amount);
                }
            }
            for asset in asset_array.clone() {
               let  (token_address,from,amount,claimed) = asset;
               let  claimed_update = true;
                let index = asset_array.first_index_of((token_address.clone(),from.clone(),amount,claimed));
                let index_value: u32 = index.unwrap_or(0);
                asset_array.set(index_value,(token_address,from,amount,claimed_update));
            }
            
            asset_map.set(claimer.clone(),asset_array);
            env.storage().persistent().set(&BENI, &asset_map);
            will_map.set(claimer, benificary_assets);
            env.storage().persistent().set(&from, &will_map);
        } else {
            // Err(Error::NO_WILL_EXIST)
        }
    }
    //to mimic the signiing of the signature
    pub fn test_admin_sign(_env: Env) -> bool {
        true
    }
}
mod test;
