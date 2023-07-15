import { CircularProgress, Slide, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import "./App.css";

function App() {
  //*UseState ile state(Değişkenleri) tanımlıyoruz.
  //Hava durumu bilgilerini almak için kullanacağımız state
  const [cityName, setCityName] = useState("Turkey");
  //Kullanıcının arama yapması için kullanacağımız state
  const [inputText, setInputText] = useState("");
//Hava durumu bilgilerini tutacağımız state
  const [data, setData] = useState({});
    //Hata durumunda kullanıcıya göstereceğimiz state
  const [error, setError] = useState(false);
  //Api'den verileri çekerken kullanıcıya göstereceğimiz loading state
  const [loading, setLoading] = useState(true);

//!React, varsayılan olarak ilk render da dahil olmak üzere her render işleminden sonra effect fonksiyonunu çalıştırır.
//!Calisma prensibi, kendisine verecegimiz iki parametreye dayaniyor. Bunlardan ilki, gerceklestirmesini istedigimiz islemleri iceren fonksiyon, ikincisi ise soz konusu fonksiyonun hangi durumlarda calisip hangi durumlarda calismayacagini belirtebilecegimiz bir array degeri

  useEffect(() => {
    //!openweathermap sitesinden aldığımız api key ile fetch işlemi yapıyoruz.
    //?https://api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}
    //aa51364c45a7d309ec83da0c331987e3
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=aa51364c45a7d309ec83da0c331987e3&units=metric`
    )
      .then((res) => {
        if (res.status === 200) {
          error && setError(false);
          return res.json();
        } else {
          throw new Error("There was an error calling Api");
        }
      })
      //!Data başarılı bir şekilde geldiğinde setData fonksiyonu ile state'i güncelliyoruz.
      .then((data) => {
        setData(data);
      })
      //!Hata durumunda ise setError fonksiyonu ile state'i güncelliyoruz.
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [cityName, error]);

  useEffect(() => {
    document.title = "React Weather App"
  })

//Arama işlemini gerçekleştirmek için handleSearch fonksiyonunu kullanıyoruz.
  const handleSearch = (e) => {
    if (e.key === "Enter") {
      setCityName(e.target.value);
      //Arama işlemi gerçekleştikten sonra inputText state'ini boşaltıyoruz.
      setInputText("");
    }
  };

  return (
    <div className="bg_img">
      {!loading ? (
        <>
      {/*   Şehir arama bölümü */}
          <TextField
            variant="filled"
            label="Search location"
            className="input"
            error={error}
            value={inputText}
           /*  Değişkliği yakalamak için onChange eventini kullanıyoruz.
            yazılan şehri e.target.value alıyoruz. */
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleSearch}
          />
          <h1 className="city">{data.name}</h1>
          <div className="group">
         {/*    Hava Durumu iconu */}
            <img
              src={`http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`}
              alt="Weather İcon"
            />
            {/* Havanin yağmurlu mu açık mı olduğu */}
            <h1>{data.weather[0].main}</h1>
          </div>
            {/*  tofised ile dereceyi düzeltiyoruz.27.4=>27 */}
          <h1 className="temp">{data.main.temp.toFixed()} °C</h1>

          <Slide direction="right" timeout={1000} in={!loading}>
            <div className="box_container">
              <div className="box">
              {/*   Nem */}
                <p>Humidity</p>
                <h1>{data.main.humidity.toFixed()}%</h1>
              </div>
               {/* Rüzgar */}
              <div className="box">
                <p>Wind</p>
                <h1>{data.wind.speed.toFixed()} km/h</h1>
              </div>
               {/* Hissedilen Sıcaklık */}
              <div className="box">
                <p>Feels Like</p>
                <h1>{data.main.feels_like.toFixed()} °C</h1>
              </div>
            </div>
          </Slide>
        </>
      ) : (
        <CircularProgress />
      )}
    </div>
  );
}

export default App;
