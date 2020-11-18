import React, {useEffect} from 'react'

export default function IndexPage(props) {

    useEffect(() => {
        const token = localStorage.getItem("CC_Token");
        if(!token){
            props.history.push("/login");
        }else{
            props.history.push("/dashboard");
        }
        //eslint-disable-next-line
    }, [0]);

    return (
        <div>
            
        </div>
    )
}
