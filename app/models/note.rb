class Note < ActiveRecord::Base
  acts_as_paranoid

  # validates :title, presence: true
end
