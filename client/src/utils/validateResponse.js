export default ({data}) => {
    console.log("VALIDATE error", data);
    if(data.status === "ok") {
        console.log("VALIDATE ok");
        return true
    } else {
        console.log("VALIDATE error");
        console.log(`Ошибка: ${data.error || data.code}`);
        return false;
    }
}