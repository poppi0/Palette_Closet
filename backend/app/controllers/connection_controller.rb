class ConnectionController < ApplicationController
    def show
        render json: { message: "API通信成功"}
    end
end
