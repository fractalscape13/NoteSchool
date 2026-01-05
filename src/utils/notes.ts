export type Note = {
  name: string;
  altName?: string;
  audioFile: number;
  natural: boolean;
};

export const notes: Note[] = [
  { name: 'C', audioFile: require('../../assets/audio/C.mp3'), natural: true },
  { name: 'C♯', altName: 'D♭', audioFile: require('../../assets/audio/Cs.mp3'), natural: false },
  { name: 'D', audioFile: require('../../assets/audio/D.mp3'), natural: true },
  { name: 'D♯', altName: 'E♭', audioFile: require('../../assets/audio/Ds.mp3'), natural: false },
  { name: 'E', audioFile: require('../../assets/audio/E.mp3'), natural: true },
  { name: 'F', audioFile: require('../../assets/audio/F.mp3'), natural: true },
  { name: 'F♯', altName: 'G♭', audioFile: require('../../assets/audio/Fs.mp3'), natural: false },
  { name: 'G', audioFile: require('../../assets/audio/G.mp3'), natural: true },
  { name: 'G♯', altName: 'A♭', audioFile: require('../../assets/audio/Gs.mp3'), natural: false },
  { name: 'A', audioFile: require('../../assets/audio/A.mp3'), natural: true },
  { name: 'B♭', audioFile: require('../../assets/audio/As.mp3'), natural: false },
  { name: 'B', audioFile: require('../../assets/audio/B.mp3'), natural: true },
]; 