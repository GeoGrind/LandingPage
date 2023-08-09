import { User } from 'types/user.type';
import Messages from '../Messages/Messages';
import Input from '../Input/Input';

interface IChatProps {
  curUser: User;
  chatRoomId: string;
}

function Chat({ curUser, chatRoomId }: IChatProps) {
  return (
    <div className="chat">
      <div className="chatInfo">
        <span>{curUser.username}</span>
      </div>
      <Messages curUser={curUser} chatRoomId={chatRoomId} />
      <Input curUser={curUser} chatRoomId={chatRoomId} />
    </div>
  );
}

export default Chat;
