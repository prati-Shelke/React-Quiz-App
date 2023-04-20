import React,{useState,useEffect} from 'react'
import {useLocation,useNavigate} from 'react-router-dom'
import {fetchTest} from "./dataFetching"
import "../index.css"


function QuestionList() {
    
    const num = JSON.parse( localStorage.getItem("pageNumber")) || 0
    // const q = JSON.parse( localStorage.getItem("newObject")) || []
    let CorrectCount = JSON.parse( localStorage.getItem("CorrectCount")) || 0
    let inCorrectCount = JSON.parse( localStorage.getItem("inCorrectCount")) || 0
    let value,InitialValue,choosedAns,sum1=0,sum2=0
   
    const location = useLocation()
    let index = location.state.index
    let navigate = useNavigate()
    // const testId = useParams()
    const [test,setTest]=useState() 
    const [pageNumber,setPageNumber]  = useState(num)
    const [Question, setQuestion] = useState([])
    let [RadioSelected,setRadioSelected] = useState()
    let [CheckBoxSelected,setCheckBoxSelected] = useState([])
    // const [Answer,setAnswer] = useState([])
    const questionPerPage = 1
    const pagesVisited = pageNumber * questionPerPage
    let localStore = JSON.parse(localStorage.getItem("checked"))

   
    
    useEffect(() => {

        const fetchTests = async() => {
            //to disable browser back button
            window.onpopstate = function () {
                navigate(1);
            };

            const data = await fetchTest(index)
            setTest(data)
            
            localStorage.setItem("pageNumber",JSON.stringify(pageNumber))
            localStorage.setItem("CorrectCount",CorrectCount)
            localStorage.setItem("inCorrectCount",inCorrectCount)
           
            
            const queArray = data.questions ? data.questions.map((que,ind) =>
            {
                
                if(Object.entries(localStore[ind]).length!==0)
                {
                    InitialValue = localStore[ind].InitialValue
                    choosedAns = localStore[ind].choosedAns
                   
                    return {
                        ...que,
                        questionId:que._id,
                        type:que.type==="Multiple-Response" ? "checkbox" : "radio" ,

                        choosedAns:choosedAns,
                        InitialValue:InitialValue
                    }
                }
                else
                {
                        return {
                            ...que,
                            questionId:que._id,
                            type:que.type==="Multiple-Response" ? "checkbox" : "radio" ,
                            choosedAns:que.type==="Multiple-Response" ? Array(que.correctOptionIndex.length).fill('') : RadioSelected ,
                            InitialValue:Array(que.options.length).fill(false)
                        }
                }
                
            }):[]
        
        setQuestion(queArray)
       
        }
        fetchTests()  
    }, [])
    console.log(Question)
   
    const chagneOption = (Oind) =>
    {
        
        if(test.questions[pageNumber].type==="Multiple-Response")
           {
               const value = [...CheckBoxSelected,Oind];
               CheckBoxSelected = value
               setCheckBoxSelected(CheckBoxSelected)
           }
        else
           {
                // const value = Oind;
                RadioSelected = Oind
                setRadioSelected(RadioSelected)
           }
       
        const temp=Question.map((que,i)=>
        {
            
            if(i===pageNumber)
                {
                   
                    if(que.type==="radio")
                    {
                        que.choosedAns = RadioSelected
                        let newInitialValue = que.InitialValue.map(()=> false)
                        newInitialValue[Oind] = true
                        que.InitialValue = newInitialValue
                        
                        
                    }
                    else if(que.type==="checkbox")
                    {
                        let newInitialValue = que.InitialValue.map(()=> false)
                        
                        if(que.InitialValue[Oind]===true)
                        {
                            que.InitialValue[Oind]=false

                            for(let j=0;j<que.choosedAns.length;j++)
                            {  
                                if(que.choosedAns[j]===Oind)
                                {
                                    value=j
                                    que.choosedAns.splice(value,1)
                                    setCheckBoxSelected(que.choosedAns)
                                }
                               
                            }
                        }
                        else
                        {
                            que.choosedAns = [...CheckBoxSelected]
                            que.choosedAns.map(choose=>newInitialValue[choose] = true)
                            que.InitialValue = newInitialValue
                        }


                    }
                }
                
                return que
            }
        )

        localStore[pageNumber] =
        {
            qIndex:pageNumber,
            InitialValue:Question[pageNumber].InitialValue,
            choosedAns:Question[pageNumber].choosedAns
        }
        // console.log(pageNumber)
        localStorage.setItem("checked",JSON.stringify(localStore))
        setQuestion(temp)
    }
    

    //navigate to previous page
    const previousPage = () =>
    {
        localStorage.setItem("pageNumber" ,pageNumber-1)
        setPageNumber(pageNumber-1)
        navigate(`../questionList/${test._id}/${test.questions[pageNumber-1]._id}`, { state: { index } })
    }
    

    //navigate to next page
    const nextPage = () =>
    {
        setCheckBoxSelected([])
        
        localStorage.setItem("pageNumber" ,pageNumber+1)
        setPageNumber(pageNumber+1)
        // console.log(test.questions[pageNumber]._id);
        navigate(`../questionList/${test._id}/${test.questions[pageNumber+1]._id}`, { state: { index } })
    }
    
    //submit test
    const submitTest = () =>
    {
        let result=window.confirm("Do you want to submit the test?")
        
        if(result)
        {
                Question.map((que)=>
                {
                    if(que.type==="radio")
                    {
                        if(que.choosedAns===que.correctOptionIndex)
                            {
                                CorrectCount++
                                localStorage.setItem("CorrectCount",CorrectCount)
                            }
                        else
                            {
                                inCorrectCount++
                                localStorage.setItem("inCorrectCount",inCorrectCount)
                            }
                    }

                    else if(que.type==="checkbox")
                    {
                        
                        if(que.choosedAns.length === que.correctOptionIndex.length)
                        {
                            
                            for(let j=0;j<que.choosedAns.length;j++)
                            {
                                sum1 = sum1 + parseInt(que.choosedAns[j])
                                sum2 = sum2 + parseInt(que.correctOptionIndex[j])
                            }
                            if(sum1===sum2)
                            {
                               
                                CorrectCount++;
                                localStorage.setItem("CorrectCount",CorrectCount)
                            }
                            else
                            {
                                inCorrectCount++
                                localStorage.setItem("inCorrectCount",inCorrectCount)
                            }
                        }
                        else
                            {
                                inCorrectCount++
                                localStorage.setItem("inCorrectCount",inCorrectCount)
                            }
                    }
                })
            
            navigate('/TestResult') 
        }     
    }

    
    return (

        <>
            {test ? 
            (
                <div> 
                    {Question.slice(pagesVisited,pagesVisited + questionPerPage).map((question) =>
                        <div className="container" key={question._id}>
                            <div className="row">
                                <h1>My Interview Portal</h1>
            
                                <div className="col-md-12">
                                    <div className="panel panel-default">
                                    <div className="panel-heading">{test.name}</div>
                                        <div className="panel-body">
                                    <form>
                                        <label>{pageNumber+1} {question.questionText}</label>

                                        {question.options.map((option,Oind) =>
                                        <div className="radio" key={option}>
                                            <label>
                                                <input 
                                                    type={typeof question.correctOptionIndex === "object" ? "checkbox": "radio"}  
                                                    name="option1" 
                                                    value={option} 
                                                    onChange={()=>chagneOption(Oind)} 
                                                    checked={ question.InitialValue[Oind]}
                                                />{option}<br/>
                                            </label>
                                            
                                        </div>
                                        )}
                                    </form>
                                </div>
                            
                                <div className="panel-footer">
                                    <button type="button" className="btn btn-success" onClick={previousPage} disabled={pageNumber===0 ? true : false}> Previous </button> &nbsp;&nbsp;
                                    <button type="button" className="btn btn-success" onClick={nextPage} disabled={pageNumber===test.questions.length-1 ? true : false}> Next </button>
                                    
                                    <button type="button" className="pull-right btn btn-danger" onClick={submitTest}>
                                        {pageNumber===test.questions.length-1 ? "Submit" : "Finish"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>)}
            </div>
            ) 
            : 
            (<div></div>)}
        </>
    )
}

export default QuestionList

