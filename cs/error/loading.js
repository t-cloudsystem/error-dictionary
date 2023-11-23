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
    return text.replace(/\n/g, '<br>');
}

const jsonFilePath = 'data.json';
const idToDisplay = getParameterByName('id'); // クエリパラメータを文字列として取得

fetch(jsonFilePath)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        const userDataDiv = document.querySelector('#userData');
        const user = data.find(item => item.id.toString() === idToDisplay); // IDを文字列として比較

        if (user) {
            const userDiv = document.createElement('div');
            const embed_status = document.createElement('h2');
            const embed_condition = document.createElement('p');
            const embed_cause = document.createElement('p');
            const embed_actions = document.createElement('p');
            const embed_report = document.createElement('h2');
            const embed_forms = document.createElement('p');

            embed_status.textContent = `E${user.id}（${user.status}）`;
            embed_condition.textContent = `出現条件: ${convertNewlineToBr(user.condition)}`;
            embed_cause.innerHTML = `原因<br>${convertNewlineToBr(user.cause)}`;
            embed_actions.innerHTML = `対処法<br>${convertNewlineToBr(user.actions)}`;
            embed_report.innerHTML = `報告はこちらから（エラーコードは自動入力されています）`;
            embed_forms.innerHTML = `<div class="google_forms"><iframe src="https://docs.google.com/forms/d/e/1FAIpQLSen8eHVbmULhOZRtAT-oan8fSIJeiXLsefr1vpiTPtOsR3stw/viewform?embedded=true&entry.271553422=%E3%83%90%E3%82%B0%E5%A0%B1%E5%91%8A&entry.192082735=%E8%A1%A8%E7%A4%BA%E3%81%95%E3%82%8C%E3%81%9F&entry.1703294069=E${user.id}" width="640" height="714" frameborder="0" marginheight="0" marginwidth="0">読み込んでいます…</iframe></div>`;

            userDiv.appendChild(embed_status);
            userDiv.appendChild(embed_condition);
            userDiv.appendChild(embed_cause);
            userDiv.appendChild(embed_actions);
            userDiv.appendChild(embed_report);
            userDiv.appendChild(embed_forms);

            userDataDiv.appendChild(userDiv);
        } else {
            const noUserMessage = document.createElement('p');
            noUserMessage.innerHTML = 'IDが見つかりませんでした。エラーコードが間違っている可能性があります。<br>※「E」は含まないで、4ケタのエラーコードを入力してください。<br>（もし3ケタの場合は、頭に0をつけてください）';
            userDataDiv.appendChild(noUserMessage);
        }
    })
    .catch(error => {
        console.error('Fetch error:', error)
    })
