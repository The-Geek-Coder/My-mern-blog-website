import { Footer } from "flowbite-react";
import React from "react";
import Logo from "../Logo/Logo";
import {BsDribbble, BsFacebook, BsGithub, BsInstagram, BsTwitter} from "react-icons/bs";
function FooterFun() {
  return (
    <Footer container className="border border-t-8 border-teal-500">
      <div className="w-full max-w-7xl mx-auto">
        <div className="grid w-full justify-between sm:flex md:grid-cols-1">
          <div className="m-4">
            <Logo />
          </div>
          <div className="grid grid-cols-2 gap-8 mt-4 sm:grid-cols-3  sm:gap-6">
            <div>
              <Footer.Title title="About" />
              <Footer.LinkGroup col>
                <Footer.Link
                  href="http://localhost:3000/100-days-of-coding"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {" "}
                  {/*Opening  a new window will not be blocked by any pop up with noopener noreferrer */}
                  100 days of coding.
                </Footer.Link>

                <Footer.Link
                  href="http://localhost:3000/about"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {" "}
                  {/*Opening  a new window will not be blocked by any pop up with noopener noreferrer */}
                  Swastik's Blog
                </Footer.Link>
              </Footer.LinkGroup>
            </div>

            <div>
              <Footer.Title title="About" />
              <Footer.LinkGroup col>
                <Footer.Link
                  href="http://localhost:3000/100-days-of-coding"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {" "}
                  {/*Opening  a new window will not be blocked by any pop up with noopener noreferrer */}
                  100 days of coding.
                </Footer.Link>

                <Footer.Link
                  href="http://localhost:3000/about"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {" "}
                  {/*Opening  a new window will not be blocked by any pop up with noopener noreferrer */}
                  Swastik's Blog
                </Footer.Link>
              </Footer.LinkGroup>
            </div>

            <div>
              <Footer.Title title="About" />
              <Footer.LinkGroup col>
                <Footer.Link
                  href="http://localhost:3000/100-days-of-coding"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {" "}
                  {/*Opening  a new window will not be blocked by any pop up with noopener noreferrer */}
                  100 days of coding.
                </Footer.Link>

                <Footer.Link
                  href="http://localhost:3000/about"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {" "}
                  {/*Opening  a new window will not be blocked by any pop up with noopener noreferrer */}
                  Swastik's Blog
                </Footer.Link>
              </Footer.LinkGroup>
            </div>
          </div>
        </div>
        <Footer.Divider /> 
        <div className="w-full sm:flex sm:items-center sm:justify-between">
            <Footer.Copyright href="#"  by="Swastik's Blog" year={new Date().getFullYear()} />
     
        <div className="flex gap-6 sm:mt-0 mt-4 sm:justify-center">
            <Footer.Icon href="#" icon={BsFacebook} />
            <Footer.Icon href="#" icon={BsInstagram} />
            <Footer.Icon href="#" icon={BsTwitter} />
            <Footer.Icon href="#" icon={BsGithub} />
            <Footer.Icon href="#" icon={BsDribbble} />
        </div>
        </div>
      </div>
    </Footer>
  );
}

export default FooterFun;
