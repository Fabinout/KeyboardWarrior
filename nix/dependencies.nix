with import ./channel.nix;
let
  tcrdd = callPackage (fetchFromGitHub {
    owner = "FaustXVI";
    repo = "tcrdd";
    rev= "06c0259d88a6ed9a15c91e1af5f49b4c9d0181bf";
    sha256 = "JS7NmzfeF5IFPvWPPGAoe/nOB7FPkrJDTwIRKUHcTP8=";
    fetchSubmodules = true;
  }) { nixpkgs = import ./channel.nix; };
  clever = callPackage ./clever { pkgs = import ./channel.nix;};
  old = import (fetchTarball https://github.com/NixOS/nixpkgs/archive/20.03.tar.gz) {};
  dependencies = rec {
    mongo = old.mongodb-4_0;
    devTools = [ 
      tcrdd
      git
      nixops
    ];
    buildTool = [
      nodejs
      jetbrains.idea-ultimate
    ];
    compilation = dependencies.buildTool;
    runtime = dependencies.buildTool;
    all = dependencies.devTools
    ++ dependencies.buildTool
    ++ dependencies.compilation
    ++ dependencies.runtime
    ;
  };
in dependencies
