class Answerer < ActiveRecord::Base
    belongs_to :event
    has_many :answer

    def self.check(token)
        if ck = token
            user = self.find_by(user_token: ck)
        end
    end
end
