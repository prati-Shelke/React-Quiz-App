
// import api from "../api/tests"

import axios from "axios"

export const fetchAllTest = async() =>
{
    const response = await axios.get('http://interviewapi.stgbuild.com/getQuizData')
    return response.data.tests 
}

export const fetchTest = async(index) =>
{
    const response = await axios.get('http://interviewapi.stgbuild.com/getQuizData')
    return response.data.tests[index]
}

export const fetchQuestion = async(index) =>
{
    const response = await axios.get('http://interviewapi.stgbuild.com/getQuizData')
    return response.data.tests[index].questions
}