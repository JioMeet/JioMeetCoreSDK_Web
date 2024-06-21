import { Injectable } from '@angular/core';
import { EventManager, JMClient, IJMRemotePeer } from '@jiomeet/core-sdk-web';
import { IJM_EVENTS } from '../constants/IJM-EVENTS';
import { BehaviorSubject, Subject } from 'rxjs';

import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class JmsdkService {
  audioIsMute = true;
  type: 'image' | 'none' | 'blur';
  videoIsMute = true;
  jmClient = new JMClient();
  selectedSpeaker!: string;
  selectedMic: string | undefined;
  preview: any;
  currentDominantSpeaker: any;
  private participantsStatus$: BehaviorSubject<any> = new BehaviorSubject(null);
  private participantsUpdated$: Subject<any> = new Subject();
  private localParticipant$: Subject<any> = new Subject();

  constructor(private router: Router) {
    this.type = 'none';
    this.jmClient.setLogLevel(3);
  }

  addJMEventListeners() {
    EventManager.onEvent(async (eventInfo: any) => {
      const { data } = eventInfo;
      switch (eventInfo.type) {
        case IJM_EVENTS.PEER_JOINED:
          const { remotePeers } = data;
          remotePeers.forEach((remotePeer: IJMRemotePeer) => {
            this.participantsUpdated$.next({
              user: remotePeer,
              state: 'joined',
            });
          });

          break;
        case IJM_EVENTS.PEER_UPDATED:
          const { remotePeer, updateInfo } = data;
          const { action, value } = updateInfo;
          if (action === 'AUDIO_MUTE') {
            if (value) {
              if (this.currentDominantSpeaker == remotePeer.peerId) {
                this.participantsUpdated$.next({
                  user: null,
                  state: 'dominantSpeaker',
                });
              }
            } else {
              const audioTrack = await this.jmClient.subscribeMedia(
                remotePeer,
                'audio'
              );
              audioTrack.play();
            }
          } else if (action === 'VIDEO_MUTE') {
          } else if (action === 'SCREEN_SHARE') {
            if (value) {
              this.participantsUpdated$.next({
                user: remotePeer,
                state: 'screenshareStart',
              });
            } else {
              this.participantsUpdated$.next({
                user: remotePeer,
                state: 'screenshareStop',
              });
            }
          }

          break;
        case IJM_EVENTS.PEER_LEFT:
          this.participantsUpdated$.next({
            user: data.remotePeer,
            state: 'left',
          });
          console.log('left');

          break;
        case IJM_EVENTS.DEVICE_UPDATED:
          if (data.state == 'ACTIVE' && data.deviceType == 'audioOutput') {
            this.selectedSpeaker = data.device.deviceId;
            this.jmClient.setAudioOutputDevice(data.device.deviceId);
          }
          if (
            data.state == 'ACTIVE' &&
            data.deviceType == 'audioInput' &&
            !this.audioIsMute
          ) {
            this.selectedMic = data.device.deviceId;
            this.jmClient.setAudioInputDevice(data.device.deviceId);
          }
          if (
            data.state == 'INACTIVE' &&
            data.deviceType == 'audioInput' &&
            this.selectedMic == data.device.deviceId
          ) {
            this.jmClient.setAudioInputDevice('default');
          }
          if (
            data.state == 'INACTIVE' &&
            data.deviceType == 'audioOutput' &&
            this.selectedSpeaker == data.device.deviceId
          ) {
            this.jmClient.setAudioOutputDevice('default');
          }
          break;
        case IJM_EVENTS.DOMINANT_SPEAKER:
          this.currentDominantSpeaker = data.remotePeer.peerId;
          this.participantsUpdated$.next({
            user: data.remotePeer,
            state: 'dominantSpeaker',
          });
          break;
        case IJM_EVENTS.NETWORK_QUALITY:
          const quality = this.mapQualityLevel(
            data?.uplinkNetworkQuality,
            data?.downlinkNetworkQuality
          );
          this.localParticipant$.next({
            data: quality,
            action: 'networkQuality',
          });
          break;
        default:
          break;
      }
    });
  }

  async createPreview() {
    await this.jmClient.createPreview('1');
    this.preview = await this.jmClient.getPreview('1');
  }
  getLocalParticipant() {
    return this.localParticipant$;
  }
  async leaveMeeting() {
    await this.jmClient.leaveMeeting();
    this.participantsUpdated$.next({ user: [], state: 'localLeft' });
  }
  async startScreenShare() {
    try {
      await this.jmClient
        .startScreenShare()
        .then(() => {
          this.localParticipant$.next({
            localpeer: this.getLocalUser(),
            action: 'startShare',
          });
        })
        .catch(() => {});
    } catch (error) {
      console.log('Failed to start screen share', error);
    }
  }

  async stopScreenShare() {
    try {
      await this.jmClient.stopScreenShare().then(() => {
        this.localParticipant$.next({
          localpeer: this.getLocalUser(),
          action: 'stopShare',
        });
      });
    } catch (error) {
      console.log('Failed to stop screen share', error);
    }
  }
  getParticipantsUpdated() {
    return this.participantsUpdated$;
  }

  async toggleVideoStatus() {
    try {
      this.videoIsMute = !this.videoIsMute;
      await this.jmClient
        .muteLocalVideo(this.videoIsMute)
        .then(() => {
          this.localParticipant$.next({
            localpeer: this.getLocalUser(),
            action: this.videoIsMute ? 'videoOff' : 'videoOn',
          });
        })
        .catch((e) => {
          console.log('Error toggle Video', e);
          this.videoIsMute = !this.videoIsMute;
        });
      if (!this.videoIsMute) {
        this.localParticipant$.next({
          localpeer: this.getLocalUser(),
          action: 'videoOn',
        });
      }
    } catch {
      console.log('error while video switching');
    }
  }

  mapQualityLevel(uplink, downlink) {
    const maxQuality = Math.max(uplink, downlink);
    switch (maxQuality) {
      case 0:
        return 'NONE';
      case 1:
      case 2:
        return 'GOOD';
      case 3:
      case 4:
        return 'BAD';
      case 5:
        return 'VERYBAD';
      default:
        return 'NONE';
    }
  }

  async toggleLocalVideoStatus() {
    try {
      this.videoIsMute = !this.videoIsMute;
      await this.preview
        .muteLocalVideo(this.videoIsMute)
        .then(async () => {
          if (
            !this.videoIsMute &&
            this.preview.previewInstance.localUser.videoTrack
          ) {
            this.preview.previewInstance.localUser.videoTrack.play('localpeer');
          }
        })
        .catch(() => {
          this.videoIsMute = !this.videoIsMute;
        });
    } catch {
      console.log('error while video switching');
    }
  }
  async toggleLocalMicStatus() {
    try {
      this.audioIsMute = !this.audioIsMute;
      await this.preview
        .muteLocalAudio(this.audioIsMute)
        .then(() => {})
        .catch(() => {
          this.audioIsMute = !this.audioIsMute;
        });
    } catch {
      console.log('error while mic switching');
    }
  }

  getLocalUser() {
    return this.jmClient.room.localPeer;
  }
  toggleMicStatus() {
    try {
      this.audioIsMute = this.getLocalUser().audioMuted;
      this.jmClient
        .muteLocalAudio(!this.audioIsMute)
        .then(() => {
          this.audioIsMute = !this.audioIsMute;
          this.localParticipant$.next({
            localpeer: this.getLocalUser(),
            action: this.audioIsMute ? 'audioOff' : 'audioOn',
          });
        })
        .catch((e) => {
          console.log(e);
        });
    } catch {
      console.log('error Muting Mic');
    }
  }

  async joinCall(
    meetingId: string,
    pin: string,
    userName: string,
    mediaconf: any
  ) {
    await this.jmClient
      .joinMeeting({
        meetingId: meetingId,
        meetingPin: pin,
        userDisplayName: userName,
        config: {
          userRole: 'speaker',
        },
      })
      .then(async () => {
        this.router.navigate(['/conference']);
        setTimeout(async () => {
          this.addJMEventListeners();
          let sourceType: 'image' | 'none' | 'blur' = 'none';
          let localUserConfig = {
            trackSettings: {
              audioMuted: mediaconf.isMicMuted,
              videoMuted: mediaconf.VideoMuted,
              audioInputDeviceId: '',
              audioOutputDeviceId: '',
              videoDeviceId: '',
            },
            virtualBackgroundSettings: {
              isVirtualBackground: false,
              sourceType,
              sourceValue: '',
            },
          };
          await this.jmClient.publish(localUserConfig).then(() => {
            if (!this.preview.previewInstance.localUserSettings?.videoMuted) {
              this.localParticipant$.next({
                localpeer: this.getLocalUser(),
                action: this.videoIsMute ? 'videoOff' : 'videoOn',
              });
            }
            if (!this.preview.previewInstance.localUserSettings.audioMuted) {
              this.localParticipant$.next({
                localpeer: this.getLocalUser(),
                action: this.audioIsMute ? 'audioOff' : 'audioOn',
              });
            }
          });
        }, 500);
        console.log('joinedSuccessfully');
      })
      .catch(() => {
        console.log('errpr While Joining');
      });
  }
}
