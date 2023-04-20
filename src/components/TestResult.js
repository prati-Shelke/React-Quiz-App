import React , {useEffect} from 'react'
import { useNavigate } from 'react-router'

function TestResult() {

    let navigate = useNavigate()

    useEffect(() => {
        window.onpopstate = function () {
            navigate(1);
        };
       
    }, [])

    const handleClick= () =>
    {
        navigate('/InterviewPortal')
    }
    return (
        <div>
            <div className="container">
                <div className="row">
                    <h1>My Interview Portal</h1>
                    
                    <div className="col-md-12">
                        <div className="panel panel-default">
                            <div className="panel-heading">AngularJS Test - Result</div>
                            <div className="panel-body">
                                <center>
                                    <h2 className="">Total no of Questions: 10</h2>
                                    <h3 className="text-success">Correct Answers: {JSON.parse( localStorage.getItem("CorrectCount"))} &nbsp;&nbsp;
                                    <span className="text-danger">Wrong Answers: {JSON.parse( localStorage.getItem("inCorrectCount"))}</span></h3>
                                    <button type="button" className="btn btn-success" onClick={handleClick}> Start Test </button>
                                </center>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TestResult
