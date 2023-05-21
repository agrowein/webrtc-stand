import React, { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import socket from "../services/socket.service";

const VideoChatComponent: React.FC = () => {
  const [remoteId, setRemoteId] = useState<string | null>();
  const socketRef = useRef<Socket | null>(null);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [, setRemoteStream] = useState<MediaStream | null>(null);
  const [isStarted, setIsStarted] = useState<boolean>(false);

  useEffect(() => {
    socketRef.current = io('http://localhost:5000/');

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  const handleStart = () => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => {
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        setLocalStream(stream);

        socketRef.current?.emit('newUser', {});

        socketRef.current?.on('offer', handleOffer);

        socketRef.current?.on('answer', handleAnswer);

        socketRef.current?.on('candidate', handleCandidate);

        socketRef.current?.on('join', (id) => {
          setRemoteId(id);
        });
      })
      .catch(error => {
        console.error('Error accessing media devices:', error);
      });

    setIsStarted(true);
  };

  const handleInitiateCall = async () => {
    try {
      // Создаем новый PeerConnection
      const peerConnection = new RTCPeerConnection();

      // Получаем локальный медиапоток
      const localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

      // Добавляем локальный медиапоток к PeerConnection
      localStream.getTracks().forEach(track => {
        peerConnection.addTrack(track, localStream);
      });

      // Создаем оффер с помощью метода createOffer
      const offer = await peerConnection.createOffer();

      // Устанавливаем локальное описание оффера как локальное описание PeerConnection
      await peerConnection.setLocalDescription(offer);

      // Отправляем оффер на сервер через сокетное соединение
      socketRef.current?.emit('offer', { to: remoteId, offer });

      // Обрабатываем ответ от сервера (если требуется)
      socketRef.current?.once('answer', (answer: RTCSessionDescriptionInit) => {
        // Обработка полученного ответа
        // Устанавливаем удаленное описание ответа как удаленное описание PeerConnection
        peerConnection.setRemoteDescription(answer);
      });

      // Обрабатываем кандидаты ICE от сервера (если требуется)
      socketRef.current?.on('candidate', (candidate: RTCIceCandidateInit) => {
        // Обработка полученного кандидата
        // Добавляем кандидата к PeerConnection
        peerConnection.addIceCandidate(candidate);
      });

      // Отображаем локальный видеопоток
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = localStream;
      }

      // Устанавливаем удаленный видеопоток на видеоэлемент
      peerConnection.ontrack = (event) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };

      // Запускаем транзакцию ICE
      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          // Отправляем кандидата на сервер через сокетное соединение
          socketRef.current?.emit('candidate', { to: remoteId, candidate: event.candidate });
        }
      };
    } catch (error) {
      console.error('Error initiating call:', error);
    }
  };

  const handleOffer = (offer: RTCSessionDescriptionInit) => {
    const peerConnection = new RTCPeerConnection();

    if (localStream) {
      localStream.getTracks().forEach(track => {
        peerConnection.addTrack(track, localStream);
      });
    }

    peerConnection.ontrack = event => {
      setRemoteStream(event.streams[0]);
    };

    peerConnection.onicecandidate = event => {
      if (event.candidate) {
        socketRef.current?.emit('candidate', { to: remoteId, candidate: event.candidate });
      }
    };

    peerConnection.setRemoteDescription(new RTCSessionDescription(offer));

    peerConnection.createAnswer()
      .then(answer => {
        peerConnection.setLocalDescription(answer);

        socketRef.current?.emit('answer', { to: remoteId, answer });
      });

    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = new MediaStream();
      (remoteVideoRef.current.srcObject as MediaStream).addTrack(peerConnection.getReceivers()[0].track);
    }
  };

  const handleAnswer = (answer: RTCSessionDescriptionInit) => {
    // @ts-ignore
    const peerConnection = remoteVideoRef.current?.srcObject?.getTracks()[0].remote.peerConnection;
    peerConnection?.setRemoteDescription(new RTCSessionDescription(answer));
  };

  const handleCandidate = (candidate: RTCIceCandidateInit) => {
    // @ts-ignore
    const peerConnection = remoteVideoRef.current?.srcObject?.getTracks()[0].remote.peerConnection;
    peerConnection?.addIceCandidate(new RTCIceCandidate(candidate));
  };


  return (
    <div>
      <video ref={localVideoRef} autoPlay muted />
      <video ref={remoteVideoRef} autoPlay />

      {!isStarted && <button onClick={handleStart}>Начать</button>}
      {isStarted && <button onClick={handleInitiateCall}>Инициировать звонок</button>}
    </div>
  );
};

export default VideoChatComponent;