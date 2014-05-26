class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :timeoutable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable,
         :validatable, :confirmable, :omniauthable,
         :lockable

  has_many :identities
  has_many :institutions
  has_many :laboratories, through: :institutions
  has_many :devices, through: :institutions
  has_many :subscribers
  has_many :policies
  has_many :granted_policies, class_name: "Policy", foreign_key: "granter_id"

  def create(model)
    if model.respond_to?(:user=)
      model.user = self
    end
    model.save
  end
end
