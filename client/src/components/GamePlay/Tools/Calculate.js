import axios from "axios"

const GetNum = async (walletAddress, factor1, factor2, factor3, factor4) => {

  const body = {
    walletAddress: walletAddress
  }
  const res = await axios
    .post(`${process.env.REACT_APP_BACKEND_URL}/api/play/getData`, body)
  if (res.data.status) {
    const number = res.data.data;
    const num = number ^ parseInt(factor1) + number ^ parseInt(factor1 - 1) + number ^ parseInt(factor1 - 3) + number * parseInt(factor4)
    return num
  } else {
    return 0
  }
}

export default GetNum