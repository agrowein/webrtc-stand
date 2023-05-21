import {useEffect, useState} from "react";
import socket from "../../services/socket.service";
import { BsCameraVideo, BsPhone } from 'react-icons/bs'

export const MainWindow = ({ startCall }: any) => {
  const [localId, setLocalId] = useState('');
  const [remoteId, setRemoteId] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    socket
      .on('init', ({ id }) => {
        setLocalId(id);
      })
      .emit('init');
  }, []);

  // звонок может выполняться как с видео, так и без него
  const callWithVideo = (video: boolean) => {
    if (!remoteId.trim()) {
      return setError('Your friend ID must be specified!')
    }
    const config = { audio: true, video }
    startCall(true, remoteId, config);
  }

  return (
    <div className='container main-window'>
      <div className='local-id'>
        <h2>Your ID is</h2>
        <p>{localId}</p>
      </div>
      <div className='remote-id'>
        <label htmlFor='remoteId'>Your friend ID</label>
        <p className='error'>{error}</p>
        <input
          type='text'
          spellCheck={false}
          placeholder='Enter friend ID'
          onChange={({ target: { value } }) => {
            setError('')
            setRemoteId(value)
          }}
        />
        <div className='control'>
          {/* видео звонок */}
          <button onClick={() => callWithVideo(true)}>
            <BsCameraVideo />
          </button>
          {/* аудио звонок */}
          <button onClick={() => callWithVideo(false)}>
            <BsPhone />
          </button>
        </div>
      </div>
    </div>
  );
};