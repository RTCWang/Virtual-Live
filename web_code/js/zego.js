function newToken(userId) {
    const token = generateToken04(APPID, userId, SERVER_SECRET, 60 * 60 * 24, '');
    console.log(">>>", generateToken04(APPID, '222', SERVER_SECRET, 60 * 60 * 24, ''))
    return token;
}

function createZegoExpressEngine() {
    var engine = new ZegoExpressEngine(APPID, SERVER);
    return engine;
}

// Step1 Check system requirements
function checkSystemRequirements(engine, cb) {
    console.log('sdk version is', engine.getVersion());
    engine.checkSystemRequirements().then((result) => {
        if (!result.webRTC) {
            cb(false, 'browser is not support webrtc!!');
        } else if (!result.videoCodec.H264 && !result.videoCodec.VP8) {
            cb(false, 'browser is not support H264 and VP8');
        } else if (!result.camera && !result.microphone) {
            cb(false, 'camera and microphones not allowed to use');
        } else {
            if (result.videoCodec.VP8) {
                if (!result.screenSharing) console.warn('browser is not support screenSharing');
            } else {
                console.log('不支持VP8，请前往混流转码测试');
            }
            cb(true, null);
        }
    });


}


function initEvent(engine, onAddRemoteStream) {
    engine.on('roomUserUpdate', (roomID, updateType, userList) => {
        console.log('>>roomUserUpdate', roomId, state)
    });
    engine.on('roomStateUpdate', (roomId, state) => {
        console.log('>>roomStateUpdate', roomId, state)
    })
    engine.on('roomStreamUpdate', async (roomID, updateType, streamList, extendedData) => {
        console.log(">>update")
        // streams added
        if (updateType === 'ADD') {
            const addStream = streamList[streamList.length - 1]
            if (addStream && addStream.streamID) {
                onAddRemoteStream(addStream.streamID)
            }
        } else if (updateType == 'DELETE') {
            //  del stream
            const delStream = streamList[streamList.length - 1]
            if (delStream && delStream.streamID) {
                if (delStream.streamID === remoteStreamID) {
                    engine.stopPlayingStream(remoteStreamID)
                }
            }
        }
    });
}


// Step5 Start Play Stream
function playingStream(engine, videoId, streamId, cb, options = {
    video: true,
    audio: true
}) {

    engine.startPlayingStream(streamId, options).then((remoteStream) => {
        const remoteView = engine.createRemoteStreamView(remoteStream);
        remoteView.play(videoId, {
            objectFit: "cover",
            enableAutoplayDialog: true,
        })
        cb(true, remoteStream);
    }).catch((err) => {
        cb(false, err)
    });
}
function stopPlaying(engine, stremId) {

    engine.stopPlayingStream(stremId)
}


//  Login room
function loginRoom(engine, roomId, userId, userName, cb) {
    var token = newToken(userId);
    engine.loginRoom(roomId, token, {
        userID: userId,
        userName
    }).then((result) => {
        cb(true, result);
    }).catch((err) => {
        cb(false, err)
    });

}
// Logout room
function logoutRoom(engine, roomId) {
    engine.logoutRoom(roomId);
}