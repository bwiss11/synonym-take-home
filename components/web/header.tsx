import Image from "next/image";
import "../../app/css/App.css";
import synonym from "../../public/synonym.svg";
const Header = () => {
  return (
    <div style={{ width: "90%", marginTop: "1rem" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "left",
          alignItems: "center",
          paddingLeft: "10px",
        }}
      >
        <Image src={synonym} alt="Synonym" width={264} height={60} className="ml-2 cursor-pointer" />
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div style={{ width: "100%", marginTop: "20px" }}>
          <div style={{ width: "100%", marginTop: "20px" }}>
            <div className="line thick-line" style={{ marginTop: "10px" }}></div>
            <div
              style={{
                textAlign: "left",
                fontFamily: "Arial",
                fontSize: "2rem",
                marginTop: "1.5rem",
              }}
            >
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
