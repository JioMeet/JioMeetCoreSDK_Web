<p align="center" >
  <img src="https://jiomeetpro.jio.com/assets/img/website/website_logo_header_light.svg" title="logo" float=center  height="160">
</p>

# 👋 JioMeet Core Web SDK

Introducing JioMeet Web SDK, a developer-friendly audio and video SDK designed for easy integration. Our platform provides a reliable and secure foundation for building real-time communication solutions. With a comprehensive set of APIs, developers can quickly add high-quality audio and video capabilities to their applications.

## Table of Contents

- [👋 Introduction](#👋-introduction)
- [🏗️ Architecture Diagram](#🏗️-architecture-diagram)
- [🚀 How to Install SDK](#🚀-how-to-install-sdk)
- [🏁 Setup](#🏁-setup)
- [🧑‍💻 Quick Start Code](#🧑‍💻-quick-start-code)
- [⭐️ Fundamental components](#⭐️-fundamental-components)
- [🏠 JMClient Class](#🏠-jmclient-class)
- [👑 Host Control](#👑-host-control)
- [📢 Event Manager](#📢-event-manager)
- [👀 Preview Manager](#👀-preview-manager)
- [📸 Device Manager](#📸-device-manager)
- [❌ Error Handling](#❌-error-handling)
- [🐞 Logger](#🐞-logger)

## 🏗️ Architecture Diagram

<p align="center" > 
  <img src="https://storage.googleapis.com/cpass-sdk/assets/screenshots/Web/CoreSdkWeb-ArchitectureDiagram.png" title="architecture Diagram" float=center height=512>
</p>

## 🚀 How to Install SDK

You can install the SDK using npm :

To install via [NPM](https://www.npmjs.com/):

```bash
npm install @jiomeet/core-sdk-web
```

## 🏁 Setup

#### Register on JioMeet Platform:

You need to first register on Jiomeet platform. [Click here to sign up](https://platform.jiomeet.com/login/signUp)

#### Get your application keys:

Create a new app. Please follow the steps provided in the [Documentation guide](https://dev.jiomeet.com/docs/quick-start/introduction) to create apps before you proceed.

#### Get your Jiomeet meeting id and pin

Use the [create meeting api](https://dev.jiomeet.com/docs/JioMeet%20Platform%20Server%20APIs/create-a-dynamic-meeting) to get your room id and password

## 🧑‍💻 Quick Start Code

```typescript
import { EventManager, JMClient } from '@jiomeet/core-sdk-web';

let isAudioMuted = true;
let isVideoMuted = true;
const jmClient = new JMClient();

// It is good practice to register event before calling join meeting
const unsubscribe = EventManager.onEvent((eventInfo) => {
	const { data } = eventInfo;
	switch (eventInfo.type) {
		case IJMInfoEventTypes.PEER_JOINED:
			const { remotePeers } = data;
			remotePeers.forEach((remotePeer: IJMRemotePeer) => {
				console.log('A new peer has joined the meeting:', remotePeer);
			});
			break;
		case IJMInfoEventTypes.PEER_UPDATED:
			const { remotePeer, updateInfo } = data;
			const { action, value } = updateInfo;
			if (action === 'AUDIO_MUTE' && value === false) {
				// Subscribe to the remote peer's audio track
				const audioTrack = await jmClient.subscribeMedia(remotePeer, 'audio');
				// Play the track on web page
				audioTrack.play();
			} else if (action === 'VIDEO_MUTE') {
				if (value === false) {
					// Subscribe to the remote peer's video track
					const videoTrack = await jmClient.subscribeMedia(remotePeer, 'video');
					// Play the track on web page
					videoTrack.play('divId');
				}
			} else if (action === 'SCREEN_SHARE') {
				if (value === true) {
					// Subscribe to the remote peer's screen share track
					const screenShareTrack = await jmClient.subscribeMedia(remotePeer, 'screenShare');
					// Play the track on web page
					screenShareTrack.play('divId');
				}
			}
			break;
		case IJMInfoEventTypes.PEER_LEFT:
			const { remotePeers } = data;
			remotePeers.forEach((remotePeer) => {
				console.log('A peer has left the meeting:', remotePeer);
			});
			break;
		default:
			break;
	}
});

// Call the joinMeeting method to start the meeting
async function joinMeeting() {
	try {
		const userId = jmClient.joinMeeting({
			meetingId: '12345678',
			meetingPin: 'abcd2',
			userDisplayName: 'John',
			config: {
				userRole: 'speaker',
			},
		});
		console.log('Joined the meeting with user ID:', userId);
	} catch (error: any) {
		console.error('Failed to join the meeting:', error);
	}
}

// Mute/unMute Local Audio
async function toggleMuteAudio() {
	try {
		isAudioMuted = !isAudioMuted;
		await JMClient.muteLocalAudio(isAudioMuted);
		console.log(`Local audio ${isAudioMuted ? 'muted' : 'unmuted'}`);
	} catch (error) {
		console.error(error);
	}
}

// Mute/unMute Local Video
async function toggleMuteVideo() {
	try {
		isVideoMuted = !isVideoMuted;
		await JMClient.muteLocalVideo(isVideoMuted);
		console.log(`Local video ${isVideoMuted ? 'muted' : 'unmuted'}`);
	} catch (error) {
		console.error(error);
	}
}

// Starting screen share
async function startScreenShare() {
	try {
		const screenShareTrack = await jmClient.startScreenShare();
		// Do something with the screenShareTrack object
	} catch (error) {
		console.log('Failed to start screen share', error);
	}
}

// Stopping screen share
async function stopScreenShare() {
	try {
		await jmClient.stopScreenShare();
		// Screen share stopped successfully
	} catch (error) {
		console.log('Failed to stop screen share', error);
	}
}
```

## ⭐️ Fundamental components

- [`JMClient Class`](#🏠-jmclient-class) - This is entry level of the SDk, it provide all the method to managing call.
- [`Event Manager`](#📢-event-manager) - It gives you events on any changes that occur in the SDK.
- [`Preview Manager`](#👀-preview-manager) - once you create preview you can use preview manager to create preview screen where users may check their audio and video settings prior to joining a call
- [`Device Manager`](#📸-device-manager) - With the help of device manager you can fetch device list and ask for device permission
- [`Error Handling`](#❌-error-handling) - Error handling is the process of managing errors that occur in the SDK. Its purpose is to handle errors in a suitable way and provide feedback to the user.
- [`Logger`](#🐞-logger) - The Logger object provides methods to set the log level and log callback, allowing users to control the amount and format of logs generated by the SDK

## 🏠 JMClient class

The "JMClient" class is a core class of the SDK that enables communication between users in a audio/video call. It offers various methods and properties that allow developers to create a robust and reliable audio/video conferencing application. It can be thought of as the backbone of our SDK.

###### `IJMClient`

```typescript
interface IJMClient {
	remotePeers: IJMRemotePeer[];
	localPeer: IJMLocalPeer | undefined;
	roomMediaSetting: IJMMediaSetting;
	localPeer: IJMLocalPeer | undefined;
	joinMeeting(meetingData: IJMJoinMeetingParams): Promise<string>;
	createPreview(id: string): IJMPreviewManager;
	getPreview(id: string): IJMPreviewManager;
	setLogLevel(level: number): void;
	publish(config: IJMMediaSetting): Promise<IJMLocalPeer>;
	muteLocalAudio(isMute: boolean): Promise<IJMLocalAudioTrack | void>;
	muteLocalVideo(isMute: boolean): Promise<IJMLocalVideoTrack | void>;
	startScreenShare(): Promise<IJMLocalScreenShareTrack>;
	stopScreenShare(): Promise<void>;
	audioAutoPlayUnblock(): Promise<void>;
	subscribeMedia(remotePeer: IJMRemotePeer, mediaType: 'audio' | 'video' | 'screenShare'): Promise<IJMRemoteAudioTrack | IJMRemoteVideoTrack | IJMRemoteScreenShareTrack>;
	unsubscribeMedia(remotePeer: IJMRemotePeer, mediaType: 'audio' | 'video' | 'screenShare'): Promise<void>;
	setAudioInputDevice(deviceId: string): Promise<void>;
	setAudioOutputDevice(deviceId: string): Promise<void>;
	setVideoDevice(deviceId: string): Promise<void>;
	setBackgroundImage(path: string): Promise<void>;
	setBackgroundBlurring(value: string): Promise<void>;
	removeVirtualBackground(): Promise<void>;
	hardMuteUnmutePeersAudio(isMute: boolean): Promise<void>;
	toggleMeetingLock(): Promise<void>;
	softMutePeersAudio(): Promise<void>;
	raiseHand(isRaised: boolean): Promise<void>;
	lowerAllUsersHands(): Promise<void>;
	startRecording(): Promise<void>;
	stopRecording(): Promise<void>;
	requestMediaToggle(requestedPeerId: string, requestedMediaType: IJMRequestMediaType): Promise<void>;
	acceptMediaToggleRequest(requestingPeerId: string, requestedMediaType: IJMRequestMediaType, requestedMuteState: boolean): Promise<void>;
	rejectMediaToggleRequest(requestingPeerId: string, requestedMediaType: IJMRequestMediaType, requestedMuteState: boolean): Promise<void>;
	lowerRemotePeerHand(peerId: string): Promise<void>;
	leaveMeeting(): Promise<void>;
}
```

#### How to use

Begin by importing the JMClient class into your project. After that, you can create an instance of the class to access its methods and functionality.

```typescript
import { JMClient } from '@jiomeet/core-sdk-web';
///create instance of the class
const jmClient = new JMClient();
```

### 🤝 Join a Room

<code>joinMeeting(meetingData: <a href="#ijmjoinmeetingparams">IJMJoinMeetingParams</a>): Promise&lt;string&gt;</code>

Before calling any method or property of the Room class, it is necessary to join a room first. This can be achieved by calling the `JoinMeeting` method on an instance of the `JMClient` class with a parameter of type [`IJMJoinMeetingParams`](#ijmjoinmeetingparams)

##### Parameters:

- **meetingId** : `string`  
  Meeting ID of the meeting user is going to
- **meetingPin** : `string`  
  Meeting PIN of the meeting user is going to
- **userDisplayName** : `string`  
  Display Name with which user is going to join the meeting.
- **config** :
  - **userRole** : `"host" | "audience" | "speaker"`  
    Role of the user in the meeting. Possible values are .host, .speaker, .audience. If you are assigning .host value, please pass the token in its argument
  - **token?** `Optional` : `string`  
    Token is optional property only required when you pass userRole as a host

##### Returns:

- UID : `sting`

Successfully call joinMeeting method return `UID` of the user

##### Example:

```typescript
/// Example of meeting parameter of type IJMJoinMeetingParams
const meetingData = {
  meetingId: "1234",
  meetingPin: "abc",
  userDisplayName: "Rohan",
  config: {
    userRole: "host" | "audience" | "speaker",
    token?: string,
  };
};

const meetingUrl = await jmClient.joinMeeting(meetingData);
```

### 💡 JMClient Properties

The `JMClient` class also provides a number of properties that give you information about the room you have joined. These properties include details about the local peer and a list of remote peers currently in the room.

#### 👥 RemotePeer

You can access the list of remote peers by accessing the remotePeers property of type [`IJMRemotePeer[]`](#ijmremotepeer)

```typescript
const remotePeers = jmClient.remotePeers;
```

#### 👤 LocalPeer

You can access the local peer by accessing the localPeer property of type [`IJMLocalPeer`](#ijmlocalpeer) | `undefined`

```typescript
const localPeer = jmClient.localPeer;
```

#### ⚙️ RoomMediaSetting

You can access the room media setting by accessing the roomMediaSetting property of type [`IJMMediaSetting`](#ijmmediasetting)

```typescript
const roomMediaSetting = jmClient.roomMediaSetting;
```

### 🔧 JMClient Methods

The `JMClient` class provides a number of methods to interact with the joined room. These methods allow you to manage your audio and video streams, subscribe to media streams from remote peers, and leave the room.

#### 👀 Create Preview

<code>createPreview(previewId:string): Promise&lt;<a href="#ijmpreviewmanager">IJMPreviewManager</a>&gt;</code>

The createPreview method creates and give the object ,this object offers developers a set of methods that can be used to design a preview screen for users to check their audio and video settings before joining a call,

check [Preview Manger](#👀-preview-manager) section for more details.

##### Parameters:

- **previewId** : `string`

##### Returns:

- **previewManager** : [`IJMPreviewManager`](#ijmpreviewmanager)

##### Example:

```typescript
const previewManager = await jmClient.createPreview('1');
```

#### 👀 Get Preview

<code>getPreview(previewId:string): Promise&lt;<a href="#ijmpreviewmanager">IJMPreviewManager</a>&gt;</code>

The getPreview method return the preview manager instance which you created using previewId

##### Parameters:

- **previewId** : `string`

##### Returns:

- **previewManager** : [`IJMPreviewManager`](#ijmpreviewmanager)

##### Example:

```typescript
const previewManager = await jmClient.getPreview('1');
```

#### 🏁 Start Publish Media

<code>publish(config: <a href="#ijmmediasetting">IJMMediaSetting</a>): Promise&lt;<a href="#ijmlocalpeer">IJMLocalPeer</a>&gt;</code>

The publish method enables you to generate a video and audio track by passing in multiple properties, and also publish the track in the room you can call these method after joinMeeting method and pass the setting user is config on Preview

It Is completely optional ,because you can still these method [`muteLocalAudio`](#🙊-muteunmute-local-audio) and [`muteLocalVideo`](#🙈-muteunmute-local-video) to enable audio and video

##### Parameters:

- **config** : [`IJMMediaSetting`](#ijmmediasetting)
  - **trackSettings**
    - **audioMuted** : `boolean`  
      Is Microphone muted
    - **videoMuted** : `boolean`  
      Is Camera muted
    - **audioInputDeviceId** : optional `boolean`  
      Audio Input (Microphone) device Id it is optional, other wise it take default value
    - **audioOutputDeviceId?** `Optional` : `boolean`  
      Audio output (Speaker) device Id it is optional, other wise it take default value
    - **videoDeviceId?** `Optional` : `boolean`  
      Video (Camera) device Id it is optional, other wise it take default value
  - **virtualBackgroundSettings**
    - **isVirtualBackground** : `boolean`  
      Weather virtual background is on or not
    - **sourceType** : `blur' | 'image' | 'none`  
      Type of virtual background
    - **sourceValue** : `string`  
       Value of virtual background , for `image` url of the image , and for `blur` value between 0 - 10

##### Returns:

`Promise<void>`

##### Example:

```typescript
// Example of data format for creating preview
const previewConfig = {
	trackSettings: {
		audioMuted: false,
		videoMuted: false,
		audioInputDeviceId: 'abc',
		videoDeviceId: 'xyz',
	},
	virtualBackgroundSettings: {
		isVirtualBackground: false,
		sourceType: 'none',
		sourceValue: '',
	},
};

await jmClient.publish(previewConfig);
```

#### 🙊 Mute/Unmute Local Audio

<code>muteLocalAudio(isMute:boolean): Promise&lt;<a href="#ijmlocalaudiotrack">IJMLocalAudioTrack</a> | void&gt;</code>

This method allows you to mute or unmute the local user's audio. If unmuting is successful, the method returns a promise that resolves to the audio track. If muting is successful, the method returns void. Additionally, this method also publishes the track to remote users if it is unmuted and unpublishes it if it is muted.

##### Parameters:

- **isMute** : `boolean`

##### Returns:

- [`IJMLocalAudioTrack`](#ijmlocalaudiotrack) : If isMute is `false` (unmute)
- `void` : If isMute is `true` (mute)

##### Example:

```typescript
await jmClient.muteLocalAudio(true);
```

#### 🙈 Mute/Unmute Local Video

<code>muteLocalVideo(isMute:boolean): Promise&lt;<a href="#ijmlocalvideotrack">IJMLocalVideoTrack</a> | void&gt;</code>

This method allows you to mute or unmute the local user's video. If unmuting is successful, the method returns a promise that resolves to the video track. If muting is successful, the method returns void. Additionally, this method also publishes the track to remote users if it is unmuted and unPublishes it if it is muted.

##### Parameters:

- **isMute** : `boolean`

##### Returns:

- [`IJMLocalVideoTrack`](#ijmlocalvideotrack) : If isMute is `false` (unmute)
- `void` : If isMute is `true` (mute)

##### Example:

```typescript
await jmClient.muteLocalVideo(true);
```

#### 🙆 Subscribe Media

<code>subscribeMedia(remotePeer: <a href="#ijmremotepeer">IJMRemotePeer</a>, mediaType: "video"): Promise&lt;IJMRemoteVideoTrack&gt;</code>

<code>subscribeMedia(remotePeer: <a href="#ijmremotepeer">IJMRemotePeer</a>, mediaType: "audio"): Promise&lt;IJMRemoteAudioTrack&gt;</code>

<code>subscribeMedia(remotePeer: <a href="#ijmremotepeer">IJMRemotePeer</a>, mediaType: "screenShare"): Promise&lt;IJMRemoteScreenShareTrack&gt;</code>

Subscribes to the audio, video and screenShare tracks of a remote peer.

##### Parameters:

- **remotePeer** : [`IJMRemotePeer`](#ijmremotepeer)
  The remote peer

- **mediaType** : `"audio" | "video" | "screenShare"`

##### Returns:

Successfully call subscribeMedia return track based on mediaType [`IJMRemoteVideoTrack`](#ijmremotevideotrack) | [`IJMRemoteAudioTrack`](#ijmremoteaudiotrack) |[`IJMRemoteScreenShareTrack`](#ijmremotescreensharetrack) and you can also refer to remotePeer.videoTrack , remotePeer.audioTrack and remotePeer.screenShareTrack for the track

##### Example:

```typescript
const remotePeer = jmClient.remotePeers[0];
const remoteAudioTrack = await jmClient.subscribeMedia(remotePeer, 'audio');
```

#### 🙅 Unsubscribe Media

<p><code >unsubscribeMedia(remotePeer: <a href="#ijmremotepeer">IJMRemotePeer</a>, mediaType: "audio" | "video" | "screenShare"): Promise&lt;void&gt;</code>

Unsubscribes to the audio, video and screenShare tracks of a remote peer.

##### Parameters:

- **remotePeer** : [`IJMRemotePeer`](#ijmremotepeer)  
  The remote peer

- **mediaType** : `"audio" | "video" | "screenShare"`

##### Returns: `Promise<void>`

##### Example:

```typescript
const remotePeer = jmClient.remotePeers[0];
await jmClient.unsubscribeMedia(remotePeer, 'audio');
```

#### ⬜️ Start Whiteboard

<p><code >startWhiteBoard(): Promise&lt;void&gt;</code>

It will start the whiteboard ,after successfully start use renderWhiteBoard method to render the whiteboard in UI

##### Returns: `Promise<void>`

##### Example:

```typescript
await jmClient.startWhiteBoard();
```

#### ⬜️ Render Whiteboard

<p><code >renderWhiteBoard(element:string|HTMLElement): Promise&lt;void&gt;</code>

It will render the whiteboard inside the given div

##### **Parameters**

- **element** : `string | HTMLElement`  
  Specifies a DOM element. The SDK will create a `iframe` element under the specified DOM element to render the whiteboard. You can specify a DOM element in either of following ways:  
  `string` : Specify the ID of the DOM element.  
  `HTMLElement` : Pass a DOM object.

##### Returns: `Promise<void>`

##### Example:

```typescript
await jmClient.renderWhiteBoard();
```

#### ⬜️ Stop Whiteboard

<p><code >stopWhiteBoard(): Promise&lt;void&gt;</code>

It will stop the whiteboard and notify the user

##### Returns: `Promise<void>`

##### Example:

```typescript
await jmClient.stopWhiteBoard();
```

#### 🙋‍♂️ Raise Hand

<p><code >raiseHand(isRaised:boolean): Promise&lt;void&gt;</code>

This function take isRaised as a parameter , pass `True` to raise your hand and `False` for lower your hand
other user will be notify through `PEER_UPDATED` event

##### **Parameters**

- **isRaised** : `boolean`  
  Pass `True` for raise hand
  Pass `False` for lower hand

##### Returns: `Promise<void>`

##### Example:

```typescript
await jmClient.raiseHand(true);
```

#### 🌅 Set Background Image

<code>setBackgroundImage(path:string): Promise&lt;void&gt;</code>

You can use these methods to set a custom image as the virtual background on your local video track. When your video is unmuted, it will automatically send the video with the virtual background to the remote peer

##### Parameters:

- **path** : `string`
  Url of the image

##### Returns: `Promise<void>`

##### Example:

```typescript
await jmClient.setBackgroundImage('https://image.jpg');
```

#### 🌫 Set Background Blur

<code>setBackgroundBlurring(value:string): Promise&lt;void&gt;</code>

You can use these methods to blur the background of your local video track. When your video is unmuted, it will automatically send the video with the blur background to the remote peer

##### Parameters:

- **value** : `string`  
  value of blur from 1 - 10

##### Returns: `Promise<void>`

##### Example:

```typescript
await jmClient.setBackgroundBlurring('5');
```

#### 👨‍💼 Remove Virtual Background

<code>removeVirtualBackground(): Promise&lt;void&gt;</code>

These methods can be used to remove the virtual background from your local video track. If applied, the original video will automatically be sent to the remote peer.

##### Returns: `Promise<void>`

##### Example:

```typescript
await jmClient.removeVirtualBackground();
```

#### 🎥 Set Video Device

<code>setVideoDevice(deviceId:string): Promise&lt;void&gt;</code>

These methods is used to manually set camera device

##### Parameters:

- **deviceId** : `string`  
  deviceId of the camera

##### Returns: `Promise<void>`

##### Example:

```typescript
await jmClient.setVideoDevice('abc');
```

#### 🎤 Set Audio Input Device

<code>setAudioInputDevice(deviceId:string): Promise&lt;void&gt;</code>

These methods is used to manually set microphone device

##### Parameters:

- **deviceId** : `string`  
  deviceId of the microphone

##### Returns: `Promise<void>`

##### Example:

```typescript
await jmClient.setAudioInputDevice('abc');
```

#### 🔊 Set Audio Output Device

<code>setAudioOutputDevice(deviceId:string): Promise&lt;void&gt;</code>

These methods is used to manually set audio output device (speaker)

##### Parameters:

- **deviceId** : `string`  
  deviceId of the speaker

##### Returns: `Promise<void>`

##### Example:

```typescript
await jmClient.setAudioOutputDevice('abc');
```

#### 👋 Leave The Meeting

<code>leaveMeeting(): Promise&lt;void&gt;</code>

This method is used to leave the current meeting. Once this method is called, the user will leave the meeting and stop receiving and sending audio, video or screen share tracks.

##### Returns: `Promise<void>`

##### Example:

```typescript
await jmClient.leaveMeeting();
```

### 👑 Host Control

Only the meeting host can access certain features of the room, using following methods can be used to control the meeting

#### ⏺ Start Recording

<p><code >startRecording(): Promise&lt;void&gt;</code>

It will start the call recording and notify the user

##### Returns: `Promise<void>`

##### Example:

```typescript
await jmClient.startRecording();
```

#### ⏺ Stop Recording

<p><code >stopRecording(): Promise&lt;void&gt;</code>

It will stop the call recording and notify the user

##### Returns: `Promise<void>`

##### Example:

```typescript
await jmClient.stopRecording();
```

#### 🔇 Hard mute peers audio

<p><code >hardMuteUnmutePeersAudio(isMute: boolean): Promise&lt;void&gt;</code>

This function accepts a parameter called isMute. Providing a value of `True` will forcefully mute all participants, preventing them from unmuting themselves. Subsequent calls with `False` will lift this restriction, allowing participants to unmute as needed.

##### **Parameters**

- **isMute** : `boolean`  
  Pass `True` for hard muting all
  Pass `False` for remove hard mute

##### Returns: `Promise<void>`

##### Example:

```typescript
await jmClient.hardMuteUnmutePeersAudio(true);
```

#### 🤐 Soft mute peers audio

<p><code >softMutePeersAudio(): Promise&lt;void&gt;</code>

This function is used for a soft mute, meaning it temporarily mutes all participants at that specific moment. Unlike a hard mute, where the host must remove the restriction for participants to unmute themselves, here participants can unmute on their own after the initial mute.

##### Returns: `Promise<void>`

##### Example:

```typescript
await jmClient.softMutePeersAudio();
```

#### 🙋‍♂️ Lower all peers hand

<p><code >lowerAllUsersHands(): Promise&lt;void&gt;</code>

This function lowers the hands of all raised peers.

##### Returns: `Promise<void>`

##### Example:

```typescript
await jmClient.lowerAllUsersHands();
```

#### 🙋‍♂️ Lower remote peer hand

<p><code >lowerRemotePeerHand(peerId: string): Promise&lt;void&gt;</code>

This function accepts a parameter called `peerId`. It will lowers the hand of the specified peer if it is raised.

##### **Parameters**

- **peerId** : `string`  
  peerId of remote peer whose hand you want to lower

##### Returns: `Promise<void>`

##### Example:

```typescript
await jmClient.lowerRemotePeerHand('123141');
```

#### 🗳 Request media toggle

<p><code >requestMediaToggle(requestedPeerId: string,requestedMediaType: IJMRequestMediaType): Promise&lt;void&gt;</code>

This function is used to request the audio/video toggle (mute/unmute) of the specific user, it accepts a two parameters
`requestedPeerId` peerId of the targeted remote peer and `requestedMediaType` desired media type, either audio or video

After sending the request, the remote peer responds using either `acceptMediaToggleRequest` or `rejectMediaToggleRequest`

##### **Parameters**

- **requestedPeerId** : `string`  
  peerId of the targeted remote peer
- **requestedMediaType** : [`IJMRequestMediaType`](#ijmrequestmediatype)
  desired media type, either audio or video

##### Returns: `Promise<void>`

##### Example:

```typescript
await jmClient.requestMediaToggle('123141', 'audio');
```

#### ✅ Accept media toggle

<p><code >acceptMediaToggleRequest(requestingPeerId: string, requestedMediaType: IJMRequestMediaType, requestedMuteState: boolean): Promise&lt;void&gt;</code>

This function handles the acceptance of media state changes initiated by another peer. Provides the mechanism for the local peer to acknowledge the requested changes and update the media state (mute or unmute).

Once you accept with this function your media state is change

##### **Parameters**

- **requestingPeerId** : `string`  
   Represents the peerId of the requester who initiated the toggle request.-
- **requestedMediaType** : [`IJMRequestMediaType`](#ijmrequestmediatype)  
  Represents the desired media type to be toggled, which could be audio or video.
- **requestedMuteState** : `boolean`  
  Indicates the requested mute state, specifying whether it's a request to mute or unmute.

##### Returns: `Promise<void>`

##### Example:

```typescript
await jmClient.acceptMediaToggleRequest('123431', 'audio', true);
```

#### ❌ Reject media toggle

<p><code >rejectMediaToggleRequest(requestingPeerId: string, requestedMediaType: IJMRequestMediaType, requestedMuteState: boolean): Promise&lt;void&gt;</code>

This function Handles the rejection of a toggle request initiated by another peer. Denies the requested media type toggle based on the specified parameters.

##### **Parameters**

- **requestingPeerId** : `string`  
   Represents the peerId of the requester who initiated the toggle request.-
- **requestedMediaType** : [`IJMRequestMediaType`](#ijmrequestmediatype)  
  Represents the desired media type to be toggled, which could be audio or video.
- **requestedMuteState** : `boolean`  
  Indicates the requested mute state, specifying whether it's a request to mute or unmute.

##### Returns: `Promise<void>`

##### Example:

```typescript
await jmClient.rejectMediaToggleRequest('123431', 'audio', true);
```

## 📢 Event Manager

Our SDK provides events to the client about any change or update happen in the sdk after user register for the events. These events can include things like peers joining or leaving the call, audio or video status being updated, and other similar events.

To receive events from the SDK, you can use the onEvent() method of the EventsManager object. This method takes a callback function as a parameter, which will be called by the SDK when ever state change.

Here's an example of how to register for events:

##### 🤔 How to register

```typescript
import { EventManager, IJMInfoEventTypes } from '@jiomeet/core-sdk-web';

const unsubscribe = EventManager.onEvent((eventInfo) => {
	switch (eventInfo.type) {
		case IJMInfoEventTypes.PEER_JOINED:
			// Handle peer joined event
			break;
		default:
			break;
	}
});

//Or you can also subscribe specific Event like these

const unsubscribe = EventManager.onEvent(
	(eventInfo) => {
		// This will only trigger on "PEER_JOINED" event
	},
	[IJMInfoEventTypes.PEER_JOINED]
);
```

### 📦 Types Of Events

you can import [`IJMInfoEventTypes`](#ijminfoeventtypes) enum to refer the events send by the SDK,The format and value of the eventInfo is the same for all events, with only the `data` field varying depending on the type of event.

- #### PEER_JOINED

  These Events come when new peer join the call and also give the list of already join peer when you join the call first time, it has event info of type [`IJMPeerJoinEvent`](#ijmpeerjoinevent)

  ##### Interface : [`IJMPeerJoinEvent`](#ijmpeerjoinevent)

  - **id** : `number`.  
    Id is unique id of every event.
  - **type** : [`IJMInfoEventTypes`](#ijminfoeventtypes)  
    Type refer to type of event ex. `"PEER_JOINED"` in these case.
  - **data**
    - **remotePeers** : [`IJMRemotePeer[]`](#ijmremotepeer)  
      Array of remote Peers

- #### PEER_UPDATED

  These Events come when there is some update in peer Info suppose they mute and unmute etc , it has event info of type [`IJMPeerUpdateEvent`](#ijmpeerupdateevent).

  ##### Interface : [`IJMPeerUpdateEvent`](#ijmpeerupdateevent)

  - **id** : `number`.  
    Id is unique id of every event.
  - **type** : [`IJMInfoEventTypes`](#ijminfoeventtypes)  
    Type refer to type of event ex. `"PEER_UPDATED"` in these case.
  - **data**
    - **remotePeer** : [`IJMRemotePeer`](#ijmremotepeer)  
      remote Peer obj
    - **updateInfo**
      - **action** : [`IJMPeerUpdateActions`](#ijmpeerupdateactions)  
        Action specify the change in remote Peer like `"AUDIO_MUTE"`;
      - **value** : `boolean`  
        Value specify the state

  <br>

  > **`DISCONNECTED`** as action come when user is leave the call without calling leaveMeeting method , may be due to bad internet and when user come online again you will get same DISCONNECTED `event` with false as a value

- #### ROOM_UPDATED

  These Events come when there is some update in room level, Like hard mute and lower all hand etc , it has event info of type [`IJMRoomUpdateEvent`](#ijmroomupdateevent).

  ##### Interface : [`IJMRoomUpdateEvent`](#ijmroomupdateevent)

  - **id** : `number`.  
    Id is unique id of every event.
  - **type** : [`IJMInfoEventTypes`](#ijminfoeventtypes)  
    Type refer to type of event ex. `"ROOM_UPDATED"` in these case.
  - **data**
    - **remotePeer** : [`IJMRemotePeer`](#ijmremotepeer)  
      remote Peer obj
    - **updateInfo**
      - **action** : [`IJMRoomUpdateActions`](#ijmroomupdateactions)  
        Action specify the change in remote Peer like `"AUDIO_MUTE"`;
      - **value** : `boolean`  
        Value specify the state

- #### DOMINANT_SPEAKER

  These Events come when new user speak and update based on volume level [`IJMDominantSpeakerEvent`](#ijmdominantspeakerevent).

  ##### Interface : [`IJMDominantSpeakerEvent`](#ijmdominantspeakerevent)

  - **id** : `number`.  
    Id is unique id of every event.
  - **type** : [`IJMInfoEventTypes`](#ijminfoeventtypes)  
    Type refer to type of event ex. `"DOMINANT_SPEAKER"`, in these case.
  - **data**
    - **remotePeer** : [`IJMRemotePeer`](#ijmremotepeer)

- #### NETWORK_QUALITY

  These Events give network and it trigger when ever their is an change in either downlinkNetworkQuality or downlinkNetworkQuality [`IJMNetworkQualityEvent`](#ijmdominantspeakerevent).

  ##### Interface : [`IJMNetworkQualityEvent`](#ijmdominantspeakerevent)

  - **id** : `number`.  
    Id is unique id of every event.
  - **type** : [`IJMInfoEventTypes`](#ijminfoeventtypes)  
    Type refer to type of event ex. `"NETWORK_QUALITY"`, in these case.
  - **data**

    - **downlinkNetworkQuality** : number
      The calculation relies on factors such as the uplink transmission bitrate, uplink packet loss rate, round-trip time (RTT), and jitter.
    - **uplinkNetworkQuality** : number
      The calculation relies on factors such as the uplink transmission bitrate, uplink packet loss rate, round-trip time (RTT), and jitter..

    <br>

  Both the value have 0 to 5 number show different condition

  - 0: The quality is undetermined.
  - 1: The quality is outstanding.
  - 2: The quality is satisfactory, although the bitrate is suboptimal.
  - 3: Users experience minor disruptions in communication.
  - 4: Users can communicate with each other, but with some difficulty.
  - 5: The quality is extremely low, making communication nearly impossible.

- #### CONNECTION_STATE

  These Events come when the state of the connection between the SDK and the server changes. and default connection state is `DISCONNECTED` ,it has event info of type [`IJMConnectionStateEvent`](#ijmconnectionstateevent).

  ##### Interface : [`IJMConnectionStateEvent`](#ijmconnectionstateevent)

  - **id** : `number`.  
    Id is unique id of every event.
  - **type** : [`IJMInfoEventTypes`](#ijminfoeventtypes)  
    Type refer to type of event ex. `"CONNECTION_STATE"` , in these case.
  - **data**
    - **currentState** : [`IJMConnectionState`](#ijmconnectionstate);  
      current connection state
    - **previousState** : [`IJMConnectionState`](#ijmconnectionstate);  
      previous connection state

- #### PEER_LEFT

  These Events come when the remote Peer left the call ,it has event info of type [`IJMPeerLeftEvent`](#ijmpeerleftevent).

  ##### Interface : [`IJMPeerLeftEvent`](#ijmpeerleftevent)

  - **id** : `number`.  
    Id is unique id of every event.
  - **type** : [`IJMInfoEventTypes`](#ijminfoeventtypes)  
    Type refer to type of event ex. `"PEER_LEFT"`, in these case.
  - **data**
    - **remotePeers** : [`IJMRemotePeer[]`](#ijmremotepeer)  
      Array of remote Peers

- #### DEVICE_UPDATED

  These Events come when any media device added or removed ,it has event info of type [`IJMDeviceUpdateEvent`](#IJMDeviceUpdateEvent).

  <p style="padding: 5px; background-color: rgba(255,229,100,.3); border-radius:5px"><span style="font-weight:bold">Important:</span>Make sure you have device permission</p>

  ##### Interface : [`IJMDeviceUpdateEvent`](#IJMDeviceUpdateEvent)

  - **id** : `number`.  
    Id is unique id of every event.
  - **type** : [`IJMInfoEventTypes`](#ijminfoeventtypes)  
    Type refer to type of event ex. `"DEVICE_UPDATED"`, in these case.
  - **data**
    - **deviceType** : `"audioInput"|"audioOutput"|"camera"`  
      Type of device updated
    - **updateAt** : `number`:  
      The latest time when the state of the media input device was updated.
    - **initAt** : `number`:  
      The time when the SDK first detects the media input device.
    - **state** : `"ACTIVE" | "INACTIVE"`:  
      Whether device added or removed
    - **device** : `MediaDeviceInfo`:  
      Device information of the media input device

### 🛤 Tracks Concept

In the SDK, a track is a representation of audio, video, or screen sharing media. It is a custom class instance that allows you to handle the media track in your application. Like, we provide you with the [`IJMRemoteAudioTrack`](#ijmremoteaudiotrack) class instance that represents a remote audio track. You can use this instance to interact with the audio track, such as playing it. Overall, the track concept simplifies the media handling in the SDK and provides you with a convenient way to manage the media streams.

you can find track instance in [`IJMRemotePeer`](#ijmremotepeer) and [`IJMLocalPeer`](#ijmlocalpeer) respectively

- [`IJMRemoteTrack`](#ijmremotetrack)
  - [`IJMRemoteAudioTrack`](#ijmremoteaudiotrack)
  - [`IJMRemoteVideoTrack`](#ijmremotevideotrack)
  - [`IJMRemoteScreenShareTrack`](#ijmremotescreensharetrack)
- [`IJMLocalTrack`](#ijmlocaltrack)
  - [`IJMLocalAudioTrack`](#ijmlocalaudiotrack)
  - [`IJMLocalVideoTrack`](#ijmlocalvideotrack)
  - [`IJMLocalScreenShareTrack`](#ijmlocalscreensharetrack)

### Remote Track

[`IJMRemoteTrack`](#ijmremotetrack) is th base class of all remote track class which defined below

#### Properties

- **trackId**  
  This is unique Id of the track

Following are the Types of Remote Track

- ### Remote Audio Track

  [`IJMRemoteAudioTrack`](#ijmremoteaudiotrack) is the basic interface for the remote audio track.
  You can get by remote audio track by the remotePeer.audioTrack object after calling subscribe.

  #### Methods:

  - #### ▶️ Play

    <p><code >play(): void</code>
    Plays a remote audio track on the web page.

    <br>

    > When playing the audio track, you do not need to pass any DOM element.

    **Returns:** void

- ### Remote Video Track

  [`IJMRemoteVideoTrack`](#ijmremotevideotrack) is the basic interface for the remote video track.
  You can get by remote video track by the remotePeer.videoTrack object after calling subscribe.

  #### Methods

  - #### ▶️ Play

    <code>play(element:string|HTMLElement, config?:<a href="#ijmvideoplayerconfig">IJMVideoPlayerConfig</a>): void</code>

    Plays a remote video track on the web page.

    **Parameters**

    - **element** : `string | HTMLElement`  
      Specifies a DOM element. The SDK will create a `video` element under the specified DOM element to play the video track. You can specify a DOM element in either of following ways:
      `string` : Specify the ID of the DOM element.
      `HTMLElement` : Pass a DOM object.
    - **config** `Optional`: [`IJMVideoPlayerConfig`](#ijmvideoplayerconfig)  
      Sets the playback configurations, such as display mode and mirror mode. See VideoPlayerConfig. By default, the SDK enables mirror mode for a local video track.

    **Returns**: `void`

- ### Remote Screen Share Track

  [`IJMRemoteScreenShareTrack`](#ijmremotescreensharetrack) is the basic interface for the remote screen share track.
  You can get by remote screen share track by the remotePeer.screenShareTrack object after calling subscribe.

  #### Methods

  - #### ▶️ Play

    <p><code >play(element:string|HTMLElement, config?:<a href="#ijmvideoplayerconfig">IJMVideoPlayerConfig</a>): void</code>

    Plays a remote screen share track on the web page.

    **Parameters**

    - **element** : `string | HTMLElement`  
      Specifies a DOM element. The SDK will create a `video` element under the specified DOM element to play the video track. You can specify a DOM element in either of following ways:
      `string` : Specify the ID of the DOM element.
      `HTMLElement` : Pass a DOM object.
    - **config** `Optional`: [`IJMVideoPlayerConfig`](#ijmvideoplayerconfig)  
      Sets the playback configurations, such as display mode and mirror mode. See VideoPlayerConfig. By default, the SDK enables mirror mode for a local video track.

    **Returns**: `void`
    <br>

    <p style="padding: 10px; background-color: rgba(255,229,100,.3); border-radius:5px"><span style="font-weight:bold">Important:</span> If remote user share screen with audio it automatically play the audio as well</p>

### Local Track

[`IJMLocalTrack`](#ijmlocaltrack) is th base class of all local track class which defined below

##### Events

you can listen events on track object , and pass callback in it

<code>track.on("track-ended",()=>{}):void</code>

- **track-ended**
  This Event trigger when track is closed because of some issue and also usefully to handle browser `stop-share` button

##### Properties

- **trackId**  
  This is unique Id of the track
- **mediaType**  
  [`IJMMediaType`](#ijmmediatype) it is type of media

- ### Local Audio Track

  [`IJMLocalAudioTrack`](#ijmlocalaudiotrack) is the basic interface for the local audio track.
  You can get by local audio track by the local.audioTrack object after you unmute your localAudio.

  #### Methods

  - #### ▶️ Play

    <p><code >play(): void</code>

    Plays a local audio track on the web page.

    > When playing the audio track, you do not need to pass any DOM element.

  **Returns**: `void`

- ### Local Video Track

  [`IJMLocalVideoTrack`](#ijmlocalvideotrack) is the basic interface for the local video track.
  You can get by local video track by the localPeer.videoTrack object after you unmute your localVideo.

  #### Methods

  - #### ▶️ Play

      <p><code >play(element:string|HTMLElement, config?:<a href="#ijmvideoplayerconfig">IJMVideoPlayerConfig</a>): void</code>

    Plays a local video track on the web page.

    **Parameters**

    - **element** : `string | HTMLElement`  
      Specifies a DOM element. The SDK will create a `video` element under the specified DOM element to play the video track. You can specify a DOM element in either of following ways:
      `string` : Specify the ID of the DOM element.
      `HTMLElement` : Pass a DOM object.
    - **config** `optional` : [`IJMVideoPlayerConfig`](#ijmvideoplayerconfig)  
      Sets the playback configurations, such as display mode and mirror mode. See VideoPlayerConfig. By default, the SDK enables mirror mode for a local video track.

    **Returns**: `void`

- ### Local Screen Share Track

  [`IJMLocalScreenShareTrack`](#ijmlocalscreensharetrack) is the basic interface for the local screen share track.
  You can get by local screen share track by the localPeer.screenShareTrack object after calling subscribe.

  #### Methods

  - ##### ▶️ Play

    <p><code >play(element:string|HTMLElement, config?:<a href="#ijmvideoplayerconfig">IJMVideoPlayerConfig</a>): void</code>

    Plays a local screen share track on the web page.

    **Parameters**

    - **element** : `string | HTMLElement`  
      Specifies a DOM element. The SDK will create a `video` element under the specified DOM element to play the video track. You can specify a DOM element in either of following ways:
      `string` : Specify the ID of the DOM element.
      `HTMLElement` : Pass a DOM object.
    - **config** `optional` : [`IJMVideoPlayerConfig`](#ijmvideoplayerconfig)  
      Sets the playback configurations, such as display mode and mirror mode. See VideoPlayerConfig. By default, the SDK enables mirror mode for a local video track.

    **Returns**: `void`
    <br>

    <p style="padding: 10px; background-color: rgba(255,229,100,.3); border-radius:5px"><span style="font-weight:bold">Important:</span> If local user share screen with audio it automatically play the audio as well</p>

## 👀 Preview Manager

Once you call [createPreview](#👀-create-preview) method you receive previewManager object
The preview manager offers developers a set of methods that can be used to design a preview screen for users to check their audio and video settings before joining a call, and that setting you can pass to publish API. This preview class allow user to make any necessary adjustments to their settings before the call begins.

###### `IJMPreviewManager`

```typescript
interface IJMPreviewManager {
	previewMediaSetting: IJMMediaSetting;
	createPreview(config: IJMMediaSetting): Promise<void>;
	muteLocalAudio(isMute: boolean): Promise<void>;
	muteLocalVideo(isMute: boolean): Promise<void>;
	setBackgroundImage(path: string): Promise<void>;
	setBackgroundBlurring(value: string): Promise<void>;
	removeVirtualBackground(): Promise<void>;
	setAudioInputDevice(deviceId: string): Promise<void>;
	setAudioOutputDevice(deviceId: string): Promise<void>;
	setVideoDevice(deviceId: string): Promise<void>;
	play(element: string | HTMLElement, config?: IJMVideoPlayerConfig): void;
	stopPreview(): Promise<void>;
}
```

### 🔧 Preview Manager Properties

The `JMPreview` class provides a previewMediaSetting

#### 👥 PreviewMediaSetting

You can access get the preview current setting which will update by calling preview class methods, of type [`IJMMediaSetting`](#ijmmediasetting)

```typescript
const previewMediaSetting = jmClient.previewMediaSetting;
```

### 💡 Preview Manager Methods

The `JMPreview` class provides a multiple method which you can use to change the

#### 🎨 setPreviewConfig

<code>setPreviewConfig(config: <a href="#ijmmediasetting">IJMMediaSetting</a>): Promise&lt;void&gt;</code>

The setPreviewConfig method set the configuration you provide, and it creates the tracks if you pass that config. Once the tracks have been generated, you can play the video track on the web using the [play](#▶️-play-preview-video) method.

##### Parameters:

- **config** : [`IJMMediaSetting`](#ijmmediasetting)
  - **trackSettings**
    - **audioMuted** : `boolean`  
      Is Microphone muted
    - **videoMuted** : `boolean`  
      Is Camera muted
    - **audioInputDeviceId?** `Optional` : `boolean`  
      Audio Input (Microphone) device Id it is optional, other wise it take default value
    - **audioOutputDeviceId?** `Optional` : `boolean`  
      Audio output (Speaker) device Id it is optional, other wise it take default value
    - **videoDeviceId?** `Optional` : `boolean`  
      Video (Camera) device Id it is optional, other wise it take default value
  - **virtualBackgroundSettings**
    - **isVirtualBackground** : `boolean`  
      Weather virtual background is on or not
    - **sourceType** : `blur' | 'image' | 'none`  
      Type of virtual background
    - **sourceValue** : `string`  
       Value of virtual background , for `image` url of the image , and for `blur` value between 0 - 10

##### Returns: `Promise<void>`

##### Example:

```typescript
// Example of data format for creating preview
const previewConfig ={
    trackSettings: {
    audioMuted: false,
    videoMuted: false,
    audioInputDeviceId: "abc",
    videoDeviceId: "xyz",
    },
    virtualBackgroundSettings: {
    isVirtualBackground: false,
    sourceType:  'none',
    sourceValue: '',
    },
  }

  await previewManager.createPreview(config:previewConfig)
```

#### 🙊 Mute/Unmute Preview Audio

<code>muteLocalAudio(isMute:boolean): Promise&lt;void&gt;</code>

This method allows you to mute or unmute the preview audio. and update the previewMediaSetting of type [`IJMMediaSetting`](#ijmmediasetting)

##### Parameters:

- **isMute** : `boolean`

##### Returns: `Promise<void>`

##### Example:

```typescript
await previewManager.muteLocalAudio(true);
```

#### 🙈 Mute/Unmute Preview Video

<code>muteLocalVideo(isMute:boolean): Promise&lt;void&gt;</code>

This method allows you to mute or unmute the preview video, and update the previewMediaSetting of type [`IJMMediaSetting`](#ijmmediasetting)

##### Parameters:

- **isMute** : `boolean`

##### Returns: `Promise<void>`

##### Example:

```typescript
await previewManager.muteLocalVideo(false);
```

#### ▶️ Play Preview Video

<p><code >play(element:string|HTMLElement, config?:<a href="#ijmvideoplayerconfig">IJMVideoPlayerConfig</a>): void</code>

This method play the preview video track on web

**Parameters**

- **element** : `string | HTMLElement`  
  Specifies a DOM element. The SDK will create a `video` element under the specified DOM element to play the video track. You can specify a DOM element in either of following ways:  
  `string` : Specify the ID of the DOM element.  
  `HTMLElement` : Pass a DOM object.
- **config?** `Optional`: [`IJMVideoPlayerConfig`](#ijmvideoplayerconfig)  
  Sets the playback configurations, such as display mode and mirror mode. See VideoPlayerConfig. By default, the SDK enables mirror mode for a local video track.

**Returns**: `void`

##### Example:

```typescript
previewManager.play('divId', { mirror: true, fit: 'cover' });
```

#### 🌅 Set Background Image On Preview

<code>setBackgroundImage(path:string): Promise&lt;void&gt;</code>

You can use these methods to set a custom image as the virtual background on your preview video .

##### Parameters:

- **path** : `string`
  Url of the image

##### Returns: `Promise<void>`

##### Example:

```typescript
await previewManager.setBackgroundImage('https://image.jpg');
```

#### 🌫 Set Background Blur On Preview

<code>setBackgroundBlurring(value:string): Promise&lt;void&gt;</code>

You can use these methods to blur the background of your preview video.

##### Parameters:

- **value** : `string`  
  value of blur from 1 - 10

##### Returns: `Promise<void>`

##### Example:

```typescript
await previewManager.setBackgroundBlurring('5');
```

#### 👨‍💼 Remove Virtual Background

<code>removeVirtualBackground(): Promise&lt;void&gt;</code>

These methods can be used to remove the virtual background from your preview video.

##### Returns: `Promise<void>`

##### Example:

```typescript
await previewManager.removeVirtualBackground();
```

#### 🛑 Stop Preview

<code>stopPreview(): Promise&lt;void&gt;</code>

These methods can be used to stop the preview , it stop all track

##### Returns: `Promise<void>`

##### Example:

```typescript
await previewManager.stopPreview();
```

#### 🎥 Set Video Device On Preview

<code>setVideoDevice(deviceId:string): Promise&lt;void&gt;</code>

These methods is used to manually set camera device for preview

##### Parameters:

- **deviceId** : `string`  
  deviceId of the camera

##### Returns: `Promise<void>`

##### Example:

```typescript
await previewManager.setVideoDevice('abc');
```

#### 🎤 Set Audio Input Device On Preview

<code>setAudioInputDevice(deviceId:string): Promise&lt;void&gt;</code>

These methods is used to manually set microphone device for preview

##### Parameters:

- **deviceId** : `string`  
  deviceId of the microphone

##### Returns: `Promise<void>`

##### Example:

```typescript
await previewManager.setAudioInputDevice('abc');
```

#### 🔊 Set Audio Output Device On Preview

<code>setAudioOutputDevice(deviceId:string): Promise&lt;void&gt;</code>

These methods is used to manually set audio output device (speaker) for preview

##### Parameters:

- **deviceId** : `string`  
  deviceId of the speaker

##### Returns: `Promise<void>`

##### Example:

```typescript
await previewManager.setAudioOutputDevice('abc');
```

## 📸 Device Manager

With the help of device manager object you can fetch device list and also ask for microphone and camera permission

###### `IJMDeviceManager`

```typescript
interface IJMDeviceManager {
	hasWebcamPermission: boolean;
	hasMicrophonePermission: boolean;
	getMediaPermissions(audio: boolean, video: boolean): Promise<void>;
	getDevices(): Promise<IJMDeviceMap>;
}
```

### 🔧 Device Manager Properties

The `JMDeviceManager` class provides following property

#### 📷 hasWebcamPermission

hasWebcamPermission tell weather user has camera permission on not

```typescript
const hasWebcamPermission = JMDeviceManager.hasWebcamPermission;
```

#### 🎤 hasMicrophonePermission

hasMicrophonePermission tell weather user has microphone permission on not

```typescript
const hasMicrophonePermission = JMDeviceManager.hasMicrophonePermission;
```

### 💡 Device Manager Methods

The `JMPreview` class provides a couple of method which you can use to handle device

#### getMediaPermissions

<code>getMediaPermissions(audio: boolean, video: boolean): Promise&lt;void&gt;</code>

This method is used to get the device permission.

##### Parameters:

- **audio** : `boolean`
- **video** : `boolean`

##### Returns: `Promise<void>`

##### Example:

```typescript
await JMDeviceManager.createPreview(true, true);
```

#### getDevices

<code>getDevices(): Promise&lt;<a href="#ijmdevicemap">IJMDeviceMap</a>&gt;</code>

This method give you list of all devices in the form [`IJMDeviceMap`](#ijmdevicemap)

##### Returns:

- **deviceMap** : [`IJMDeviceMap`](#ijmdevicemap)

##### Example:

```typescript
await IJMDeviceMap.getDevices();
```

## ❌ Error handling

Our SDK has two types of error handling mechanisms. The first is for API errors that occur when you call a method and an error is thrown. The SDK will throw the error, which you can handle in a catch block.

The second type of error handling is for global errors that are not related to any API calls.

Here's an example of how to register for global error events:

##### 🤔 How to register

```typescript
import { EventManager, IJMErrorTypes } from '@jiomeet/core-sdk-web';

const unsubscribe = EventManager.onError((errorInfo) => {
	switch (errorInfo.type) {
		case IJMErrorTypes.MEDIA:
			// Handle Media error
			break;
		case IJMErrorTypes.NETWORK:
			// Handle Media error
			break;
		default:
			break;
	}
});

//Or you can also subscribe specific Event like these

const unsubscribe = EventManager.onError(
	(errorInfo) => {
		// This will only trigger on "MEDIA" error come
	},
	[IJMErrorTypes.MEDIA]
);
```

### 📦 Types Of Errors

you can import [`IJMErrorTypes`](#ijmerrortypes) enum to refer the error events send by the SDK

eventInfo is same for all type of event

#### Interface : [`IJMErrorEvent`](#ijmerrorevent)

- **id** : `number`.  
  Id is unique id of every event.
- **type** : [`IJMErrorTypes`](#ijmerrortypes)  
  Type refer to type of event ex. `"MEDIA"`.
- **data**
  - **errorCode** : `number`;  
    Unique Code for every error type
  - **message** : `string`;  
    Message of the error
  - **timestamp** : `Date`;  
    Time of the error generated
  - **nativeError?** `Optional`: `Error` ;  
    Native error if any

### Error Description

Following are the table that shown different error with their error code and message

| Code | Message              | Description                                                                                         | Actions to be taken                                                                                                                                        |
| ---- | -------------------- | --------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 201  | NotFoundError        | The camera or microphone is not currently accessible or usable.                                     | Check if device is correctly plug and working                                                                                                              |
| 202  | NotReadableError     | Capture device is in use by some other application                                                  | Display a notification to the user indicating that the capturing device is currently being used by another application.                                    |
| 203  | PermissionDenied     | The user has not given permission for the website or application to use their camera or microphone. | Confirm with user if he granted permission for audio, video, and screen capture                                                                            |
| 204  | OverConstrained      | This error is thrown when the requested constraints cannot be met,                                  | Pass setting which you device is supported                                                                                                                 |
| 205  | AudioAutoPlayBlocked | When browser restrict the audio to be played                                                        | The UI can present a popup or notification with a button. Once the user clicks on the button to confirm the interaction, and then audio will start playing |
| 206  | OtherMediaError      | Other media error                                                                                   | You can notify to the user to that something went wrong with media                                                                                         |
|      |                      |                                                                                                     |
| 500  | ServerError          | Internal server error                                                                               | Notify to user due to server issue he can not join the call                                                                                                |

#### 🔇 AudioAutoPlayBlocked

Many popular web browsers, such as Chrome and Safari, have implemented restrictions on autoplaying audio on web pages. These restrictions dictate that audio can only autoplay if the user has previously interacted with the page

<p style="padding: 10px; background-color: rgba(255,229,100,.3); border-radius:5px"><span style="font-weight:bold">Important:</span> If an autoplay error is encountered with a code of 205, You can display the button. Once the user interacts and confirms their engagement,audio start playing</p>

## 🐞 Logger

Our SDK provides developers with useful information, warnings, and error logs and level can be configured using the [`setLogLevel`](#🚦-set-log-level) and. The [`setLogCallback`](#📤-set-log-callback) method returns all the logs to the application and can be used to upload logs if needed.

### 🚦 Set Log Level

<code>setLogLevel(level: number):void</code>

The setLogLevel method in the SDK is used to set the output log level,

Developers can select a log level to view relevant logs and facilitate debugging. The log levels include NONE, ERROR, WARNING, INFO, and DEBUG of enum, with increasing levels of detail.

##### Parameters:

- **level** : number  
  the level of the log

  - 0: NONE. Do not output any log.
  - 1: LOG. Output all API logs ie LOG, INFO ,WARNING, ERROR.
  - 2: INFO. Output logs of the INFO, WARNING and ERROR level.
  - 3: WARNING. Output logs of the WARNING and ERROR level.
  - 4: ERROR. Output logs of the ERROR level.

##### Returns: `void`

##### Example:

```typescript
import { Logger } from '@jiomeet/core-sdk-web';

//level = 1 , give all log
await Logger.setLogLevel(1);
```

### 📤 Set Log Callback

<code>setLogCallback(callback: (level: number, tag: string, ...data: any[]) => void):void</code>

The setLogCallback method sets a callback function that is called when a log message is generated. This can be used to handle logs in a custom way, such as uploading them to a server for analysis or formatting them for display. and it is not depended on log level you set it will return all log

##### Parameters:

- **callback** : callback
  In callback it give
  - level - level of the log
  - tag - tag is by the SDK from which part is log
  - other - other data like message

##### Returns: `void`

##### Example:

```typescript
import { Logger } from '@jiomeet/core-sdk-web';

Logger.setLogCallback((level, tag, ...data) => {
	console.log('LoggerCallback', level, tag, data);
});
```

## 📖 Interfaces

#### `IJMRemotePeer`

```typescript
interface IJMRemotePeer {
	peerId: string;
	name: string;
	joinedAt?: string;
	metadata?: string;
	audioMuted: boolean;
	videoMuted: boolean;
	screenShare: boolean;
	isHost: boolean;
	audioTrack?: IJMRemoteAudioTrack;
	videoTrack?: IJMRemoteVideoTrack;
	screenShareTrack?: IJMRemoteScreenShareTrack;
}
```

#### `IJMRemoteTrack`

```typescript
interface IJMRemoteTrack {
	trackId: string;
	mediaType: IJMMediaType;
}
```

#### `IJMRemoteAudioTrack`

```typescript
interface IJMRemoteAudioTrack extends IJMRemoteTrack {
	play(): void;
}
```

#### `IJMRemoteVideoTrack`

```typescript
interface IJMRemoteVideoTrack extends IJMRemoteTrack {
	play(element: string | HTMLElement, config?: IJMVideoPlayerConfig): void;
}
```

#### `IJMRemoteScreenShareTrack`

```typescript
interface IJMRemoteScreenShareTrack extends IJMRemoteTrack {
	play(element: string | HTMLElement, config?: IJMVideoPlayerConfig): void;
}
```

#### `IJMLocalPeer`

```typescript
interface IJMLocalPeer {
	peerId: string;
	name: string;
	joinedAt?: string;
	metadata?: string;
	audioMuted: boolean;
	videoMuted: boolean;
	screenShare: boolean;
	isHost: boolean;
	audioTrack?: IJMLocalAudioTrack;
	videoTrack?: IJMLocalVideoTrack;
	screenShareTrack?: IJMLocalScreenShareTrack;
}
```

#### `IJMLocalTrack`

```typescript
interface IJMLocalTrack {
	trackId: string;
	mediaType: IJMMediaType;
	on(eventName: string, listener: (...args: any[]) => void): this;
	trackId: string;
}
```

#### `IJMLocalAudioTrack`

```typescript
interface IJMLocalAudioTrack extends IJMLocalTrack {
	play(): void;
}
```

#### `IJMLocalVideoTrack`

```typescript
interface IJMLocalVideoTrack extends IJMLocalTrack {
	play(element: string | HTMLElement, config?: IJMVideoPlayerConfig): void;
}
```

#### `IJMLocalScreenShareTrack`

```typescript
interface IJMLocalScreenShareTrack extends IJMLocalTrack {
	play(element: string | HTMLElement, config?: IJMVideoPlayerConfig): void;
}
```

#### `IJMVideoPlayerConfig`

```typescript
interface IJMVideoPlayerConfig {
	mirror?: boolean;
	fit?: 'cover' | 'contain' | 'fill';
}
```

#### `IJMMediaType`

```typescript
type IJMMediaType = 'audio' | 'video' | 'screenShare';
```

#### `IJMConnectionState`

```typescript
type IJMConnectionState = 'DISCONNECTED' | 'CONNECTING' | 'RECONNECTING' | 'CONNECTED' | 'DISCONNECTING';
```

#### `IJMPeerUpdateActions`

```typescript
type IJMPeerUpdateActions = 'AUDIO_MUTE' | 'VIDEO_MUTE' | 'HAND_RAISE' | 'SCREEN_SHARE' | 'DISCONNECTED';
```

#### `IJMInfoEventTypes`

```typescript
type IJMInfoEventTypes = 'PEER_JOINED' | 'PEER_LEFT' | 'PEER_UPDATED' | 'ERROR' | 'DEVICE_UPDATED' | 'CONNECTION_STATE';
```

#### `IJMRoomUpdateActions`

```typescript
type IJMRoomUpdateActions = 'HARD_MUTE' | 'SOFT_MUTE' | 'LOWER_ALL_HAND';
```

#### `IJMPeerJoinEvent`

```typescript
interface IJMPeerJoinEvent {
	id: number;
	type: 'PEER_JOINED';
	data: { remotePeers: IJMRemotePeer[] };
}
```

#### `IJMPeerLeftEvent`

```typescript
interface IJMPeerLeftEvent {
	id: number;
	type: 'PEER_LEFT';
	data: { remotePeers: IJMRemotePeer[] };
}
```

#### `IJMPeerUpdateEvent`

```typescript
interface IJMPeerUpdateEvent {
	id: number;
	type: 'PEER_UPDATED';
	data: {
		remotePeer: IJMRemotePeer;
		updateInfo: {
			action: IJMPeerUpdateActions;
			value: boolean;
		};
	};
}
```

#### `IJMRoomUpdateEvent`

```typescript
interface IJMRoomUpdateEvent {
	id: number;
	type: 'ROOM_UPDATED';
	data: {
		remotePeer: IJMRemotePeer;
		updateInfo: {
			action: IJMRoomUpdateActions;
			value: boolean;
		};
	};
}
```

#### `IJMConnectionStateEvent`

```typescript
interface IJMConnectionStateEvent {
	id: number;
	type: 'PEER_UPDATED';
	data: {
		currentState: IJMConnectionState;
		previousState: IJMConnectionState;
	};
}
```

#### `IJMDominantSpeakerEvent`

```typescript
interface IJMDominantSpeakerEvent {
	id: number;
	type: 'DOMINANT_SPEAKER';
	data: { remotePeer: IJMRemotePeer };
}
```

#### `IJMNetworkQualityEvent`

```typescript
interface IJMNetworkQualityEvent {
	id: number;
	type: 'NETWORK_QUALITY';
	data: {
		downlinkNetworkQuality: number;
		uplinkNetworkQuality: number;
	};
}
```

#### `IJMErrorEvent`

```typescript
interface IJMErrorEvent {
	id: number;
	type: IJMErrorTypes;
	data: IJMException;
}
```

#### `IJMErrorTypes`

```typescript
type IJMErrorTypes = 'MEDIA' | 'NETWORK' | 'SOCKET' | 'UNKNOWN';
```

#### `IJMErrorEvent`

```typescript
interface IJMDeviceUpdateEvent {
	id: number;
	type: 'DEVICE_UPDATED';
	data: IJMDeviceUpdated;
}
```

#### `IJMMediaSetting`

```typescript
interface IJMMediaSetting {
	trackSettings: {
		audioMuted: boolean;
		videoMuted: boolean;
		audioInputDeviceId?: string;
		audioOutputDeviceId?: string;
		videoDeviceId?: string;
	};
	virtualBackgroundSettings: {
		isVirtualBackground: boolean;
		sourceType: 'blur' | 'image' | 'none';
		sourceValue: string;
	};
}
```

#### `IJMJoinMeetingParams`

```typescript
interface IJMJoinMeetingParams {
	meetingId: string;
	meetingPin: string;
	userDisplayName: string;
	config: {
		userRole: 'host' | 'audience' | 'speaker';
		token?: string;
	};
}
```

#### `IJMDeviceMap`

```typescript
interface IJMDeviceMap {
	audioInput: MediaDeviceInfo[];
	audioOutput: MediaDeviceInfo[];
	videoInput: MediaDeviceInfo[];
}
```

#### `IJMRequestMediaType`

```typescript
type IJMRequestMediaType = 'audio' | 'video';
```
