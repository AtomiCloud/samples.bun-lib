{ pkgs, atomi, pkgs-2511, pkgs-unstable }:
let
  all = {
    atomipkgs = (
      with atomi;
      rec {
        /*

          */

        inherit
          /*

          */
          atomiutils
          sg
          pls;
      }
    );
    nix-unstable = (
      with pkgs-unstable;
      { }
    );
    nix-2511 = (
      with pkgs-2511;
      {

        inherit
          # standard
          git
          infisical

          treefmt
          gitlint
          shellcheck
          biome

          # language
          bun

          # test coverage
          lcov
          ;
      }
    );

  };
in
with all;
nix-2511 //
nix-unstable //
atomipkgs

