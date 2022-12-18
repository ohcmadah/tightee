import { useState } from "react";
import { deleteUser } from "../common/apis";
import { useNavigate } from "react-router-dom";
import { useAuthenticatedState } from "../contexts/AuthContext";

import Header from "../components/Header";
import Footer from "../components/Footer";
import Button from "../components/Button";
import ModalPortal from "../components/ModalPortal";
import Loading from "../components/Loading";

import cryingIcon from "../assets/crying.png";

const DeleteAccount = () => {
  const { user } = useAuthenticatedState();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const onDeleteUser = async () => {
    setIsLoading(true);
    try {
      const token = await user.getIdToken();
      await deleteUser(token);
    } catch (error) {}
    setIsLoading(false);
    navigate("/login", { replace: true });
  };

  return (
    <>
      <Header>
        <Header.Back onClick={() => navigate("/profile")}>회원탈퇴</Header.Back>
      </Header>
      <main className="text-center text-base">
        <img
          width={30}
          className="mb-2 inline-block"
          src={cryingIcon}
          alt="crying face"
        />
        <section>
          <article className="mb-4 text-xl font-bold">
            정말 타이티를 탈퇴하시겠어요?
          </article>
          <article className="mb-2">
            타이티를 탈퇴하시면
            <br />
            지금까지 쌓은 소중한 기록들이 모두 사라져요 :(
          </article>
          <article className="text-system-alert">
            탈퇴 후에는 계정을 다시 복구할 수 없으니 이 점 유의해 주세요.
          </article>
        </section>
      </main>
      <Footer className="flex items-center justify-center gap-x-3">
        <Button.Outline
          className="w-full text-grayscale-100"
          onClick={() => navigate(-1)}
        >
          아니요
        </Button.Outline>
        <Button.Outline className="w-full" onClick={onDeleteUser}>
          탈퇴할래요
        </Button.Outline>
      </Footer>

      <ModalPortal>{isLoading && <Loading.Modal />}</ModalPortal>
    </>
  );
};

export default DeleteAccount;
