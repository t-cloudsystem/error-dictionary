// URLからクエリパラメータを取得する関数
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

// 改行文字を<br>に変換する関数
function convertNewlineToBr(text) {
    return text.replace(/\n/g, "<br>");
}

const errorCode = getParameterByName('id');
if (errorCode.length == 4) {
    const jsonFilePath = `../data/${errorCode[0:2]}.json`;

    fetch(jsonFilePath)
        .then(response => {
            if (!response.ok) {
                throw new Error("エラーファイルの取得に失敗しました");
            }
            return response.json();
        })
        .then(data => {
            const userDataDiv = document.querySelector("#userData");
            const user = data.find(item => item.id.toString() === errorCode); // IDを文字列として比較
    
            if (user) {
                const userDiv = document.createElement('div');
                const embed_status = document.createElement('h2');
                const embed_condition = document.createElement('p');
                const embed_cause = document.createElement('p');
                const embed_actions = document.createElement('p');
    
                embed_status.textContent = `E${user.id}（${user.status}）`;
                embed_condition.textContent = `出現条件: ${convertNewlineToBr(user.condition)}`;
                embed_cause.innerHTML = `原因<br>${convertNewlineToBr(user.cause)}`;
                embed_actions.innerHTML = `対処法<br>${convertNewlineToBr(user.actions)}`;
    
                userDiv.appendChild(embed_status);
                userDiv.appendChild(embed_condition);
                userDiv.appendChild(embed_cause);
                userDiv.appendChild(embed_actions);
    
                userDataDiv.appendChild(userDiv);
            } else {
                const noUserMessage = document.createElement('p');
                noUserMessage.innerHTML = 'IDが見つかりませんでした。エラーコードが間違っている可能性があります。<br>※「E」は含まないで、4ケタのエラーコードを入力してください。<br>（もし3ケタの場合は、頭に0をつけてください）';
                userDataDiv.appendChild(noUserMessage);
            }
        })
        .catch(error => {
            console.error('エラー:', error)
        })    
} else {
    const errorMessage = document.createElement('p');
    errorMessage.innerHTML = 'エラーコードの形式が間違っています。<br>「E」は含まないで、4ケタのエラーコードを入力してください。<br>（もし3ケタの場合は、頭に0をつけてください）';
    userDataDiv.appendChild(errorMessage);
}
