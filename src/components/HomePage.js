import React,{useEffect,useState} from 'react'
import {useNavigate} from 'react-router-dom';
import {fetchAllTest} from "./dataFetching"

function HomePage()
{
    let navigate = useNavigate()
    const [tests,setTests]=useState(null)
    // let i=0
    useEffect(async() => {

        // const fetchTests = async() => {
        //     localStorage.setItem("CorrectCount",0)
        //     localStorage.setItem("inCorrectCount",0)
        //     localStorage.setItem("pageNumber",0)
        //     const data = await fetchAllTest()
        //     setTests(data)

        //  }
        // fetchTests()

        localStorage.setItem("CorrectCount",0)
        localStorage.setItem("inCorrectCount",0)
        localStorage.setItem("pageNumber",0)
        const data = await fetchAllTest()
        console.log(data)
            setTests(data)
       
    }, [])
    // console.log(tests)

    const handleClick=(test,index)=>
    {
        
        localStorage.setItem("checked",JSON.stringify(Array(test.questions.length).fill({})))
        // console.log(test.questions.length)
        navigate(`../questionList/${test._id}/${test.questions[0]._id}`, { state: { index } })
    }

    

    return (
                    
            
                <>{tests ?
                    (<div className="container">
                        <div className="row">
                            <h1>My Interview Portal</h1>
                        
                            <div className="col-md-12">
                                <table className="table table-striped">
                                    <thead>
                                        <tr>
                                            <th>Test</th>
                                            <th>No of Questions</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    
                                    {tests.map((test,index) =>
                                    <tbody key={test._id}>
                                        <tr>
                                            <td>{test.name}</td>
                                            <td>{test.questions.length}</td>
                                            <td className="btn btn-warning" onClick={()=>handleClick(test,index)}>Start Test</td>
                                        </tr>
                                        
                                    </tbody>
                                    )}
                                </table>
                            </div>
                        </div>
                    </div>) : (<div></div>)
                }
            </>
                
            
    )
}
export default HomePage;
