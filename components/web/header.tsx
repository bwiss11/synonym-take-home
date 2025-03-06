import Image from "next/image";
import "../../app/css/App.css";
import synonym from "../../public/synonym.svg";
const Header = () => {
  return (
    <div style={{ width: "90%", marginTop: "1rem" }}>
      <div className="header-flex">
        <Image src={synonym} alt="Synonym" width={264} height={60} className="ml-2 cursor-pointer" />
      </div>
      <div className="header-container">
        <div style={{ width: "100%", marginTop: "20px" }}>
          <div style={{ width: "100%" }}>
            <div className="line thick-line"></div>
            <div className="header-text">
              <span style={{ fontWeight: 800 }}>Take Home Challenge</span>{" "}
              <span style={{ fontWeight: 100 }}>by Blaine Wissler</span>
            </div>
            <div className="line thin-line" style={{ marginBottom: "40px" }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
