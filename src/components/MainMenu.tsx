import { Link } from "react-router-dom";


const MainMenue = ()=>{
    return  (
        <>
            <div className="w-full h-[30rem] flex justify-center items-center">
      <div className="w-1/3 h-5/6 bg-slate-800 round-sm flex flex-col items-center justify-center">
        <h1 className="text-[2rem] text-center">Welcome to </h1>
        <img src="./logo-white-color.webp" alt="nothing" className="w-5/6 mt-5"/>
        <h2 className="mt-10 text-lg">Who are you?</h2>
        <div className="mt-5 flex w-full justify-evenly">
            <Link className="btn btn-primary" to={'/user'}>User</Link>
            <Link className="btn btn-primary" to={'/benificiary'}>Benificiary</Link>
        </div>
      </div>
    </div>
        </>
    )
}
export default MainMenue;