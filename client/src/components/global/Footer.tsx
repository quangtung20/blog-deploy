import React from 'react'

const Footer = () => {
  return (
    <footer className="bg-dark text-center text-white mt-10">

      <div className="container-fluid" >

        <section className="bg-dark py-2" >
        <a
          className="btn btn-primary btn-floating m-1 border boder-light"
          style={{backgroundColor: "#3b5998"}}
          href="#!"
          role="button"
          ><i className="fab fa-facebook"></i
        ></a>


        <a
          className="btn btn-primary btn-floating m-1 border boder-light"
          style={{backgroundColor: "#dd4b39"}}
          href="#!"
          role="button"
          ><i className="fab fa-google"></i
        ></a>

        <a
          className="btn btn-primary btn-floating m-1 border boder-light"
          style={{backgroundColor: "#0082ca"}}
          href="#!"
          role="button"
          ><i className="fab fa-linkedin-in"></i
        ></a>

        <a
          className="btn btn-primary btn-floating m-1 border boder-light"
          style={{backgroundColor: "#333333"}}
          href="#!"
          role="button"
          ><i className="fab fa-github"></i
        ></a>
        </section>
    
        <div className="row text-md-start p-3 w-100 " style={{backgroundColor:'#343a40', margin:'0'}}>
          <div className="col-lg-6 col-md-12 mb-4 mb-md-0">
            <h5 className="text-uppercase" style={{color:"white"}}>About Me</h5>

            <p>
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Iste atque ea quis
              molestias. Fugiat pariatur maxime quis culpa corporis vitae repudiandae
              aliquam voluptatem veniam, est atque cumque eum delectus sint!
              Fugiat pariatur maxime quis culpa corporis vitae repudiandae
              aliquam voluptatem veniam, est atque cumque eum delectus sint!
            </p>
          </div>
          <div className="col-lg-3 col-md-6 mb-4 mb-md-0">
            <h5 className="text-uppercase"style={{color:"white"}}>Working Time</h5>

            <ul className="list-unstyled mb-0">
              <li>
                T2 - T6 : 8:00 - 17:00
              </li>
              <li>
                T7 - CN : 8:00 - 20:00
              </li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-6 mb-4 mb-md-0">
            <h5 className="text-uppercase "style={{color:"white"}}>Contact</h5>

            <ul className="list-unstyled">
              <li className="mt-1">
                Address: 51 Luong truc dam, Hoa Minh, Lien Chieu, Da Nang
              </li>
              <li className="mt-1">
                Email: quangtung20@gmail.com
              </li>
              <li className="mt-1">
                Phone: +8413456789
              </li>
              <li className="mt-1">
                Fax: +012347654
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="text-center p-3" style={{backgroundColor: "rgba(0, 0, 0, 0.2)"}}>
        © 2022 Copyright: 
        <strong> Quang Tung Napa Global</strong>
      </div>

    </footer>
  )
}

export default Footer
