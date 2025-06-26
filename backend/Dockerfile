FROM nixos/nix

WORKDIR /app
COPY . /app

RUN mkdir -p ~/.config/nix && \
    echo "experimental-features = nix-command flakes" >> ~/.config/nix/nix.conf

RUN nix build .#hide-and-seek
CMD ["/app/result/bin/hideandseek"]