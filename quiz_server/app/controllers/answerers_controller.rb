class AnswerersController < ApplicationController
    def create
        answerer = Answerer.create(event_id:params[:event_id],name: params[:name])
        #ユーザートークンの発行
        user_token = SecureRandom.uuid
        answerer.update_attributes(:user_token => user_token)
        set_user_token_cookie(user_token)
        render_success("ユーザーの作成に成功しました")
    end

    def update
    end

    def show
        get_user_info
        render :json => @user
    end

    def get_question
        get_user_info
        render :json => @user.event.questions.find_by(is_current: true)
    end

    private

    def set_user_token_cookie(user_token)
        cookies[:quiz_user_token] = { :value => user_token, :expires => 1.days.from_now}
    end

    def get_user_info
        unless @user = Answerer.check(cookies[:quiz_user_token])
            render_fault("セッションが切れました")
        end
    end

end