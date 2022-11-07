import eyesIcon from "../assets/eyes.png";
import Header from "../components/Header";

const Profile = () => (
  <div>
    <Header>
      <img
        src={eyesIcon}
        alt="eyes"
        className="mr-4 inline-block h-[40px] w-[40px]"
      />
      나의 프로필
    </Header>
  </div>
);

export default Profile;
