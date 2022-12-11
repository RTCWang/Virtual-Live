var engine = createZegoExpressEngine();
engine.setDebugVerbose(false); //关闭调试信息

var streamId = "room_" + new Date().getDay()

function toast(text, time = 1000) {
    let toast = document.getElementById('toast');
    let toast_box = document.getElementsByClassName('toast_box')[0];
    toast.innerHTML = text;
    toast_box.style.animation = 'show 1.5s'
    toast_box.style.display = 'inline-block';
    setTimeout(function () {
        toast_box.style.animation = 'hide 1.5s'
        setTimeout(function () {
            toast_box.style.display = 'none';
        }, 1400)
    }, time)
}

function onPlayingCB(isSucc, data) {

}

function onAddRemoteStream(streamId) {
    playingStream(engine, 'playVideo', streamId, onPlayingCB)
}
function onLoginRS(isSucc, data) {
    if (isSucc) {
        console.log('>>', $('.loginPanel'))
        $('.loginPanel').style.display = 'none'
        toast("登录成功")
    } else {
        console.error(data)
        toast("登录失败：" + data)
    }
}
function getInpData() {
    var userId = $("#userId").value.trim();
    var roomId = $("#roomId").value.trim();
    if (userId.length <= 0) {
        $("#loginErrorMsg").innerText = "请输入用户ID"
        return null;
    }
    if (roomId.length <= 0) {
        $("#loginErrorMsg").innerText = "请输入房间号"
        return null;
    }
    return { uid: userId, rid: roomId }
}

$("#loginBtn").onclick = function () {
    checkSystemRequirements(engine, function (isSucc, data) {
        if (!isSucc) toast(data);
        var inpData = getInpData();
        if (!inpData) return;
        var uid = inpData.uid;
        var rid = inpData.rid;
        initEvent(engine, onAddRemoteStream);
        loginRoom(engine, rid, uid, uid, onLoginRS);
    });
}
