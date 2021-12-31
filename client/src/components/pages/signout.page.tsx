import { useContext, useEffect } from "react";
import { AuthContext } from "../../providers/auth.provider";
import { useNavigate } from "react-router-dom";

const SignOutPage = () => {
  const authContext = useContext(AuthContext);
  const navigation = useNavigate();

  useEffect(() => {
    console.log("sign out page");

    (async () => {
      await authContext.signout();
      navigation("/signin", { replace: true });
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authContext]);

  return <></>;
};

export default SignOutPage;
