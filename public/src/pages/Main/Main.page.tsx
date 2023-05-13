import {Outlet} from "react-router";

export const MainPage = () => {
  return (
    <div className='main-page'>
      <Outlet />
    </div>
  );
};