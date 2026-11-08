class Color < ApplicationRecord
  belongs_to :tone, optional: true

  validates :name, presence: true
  validates :hex_code, presence: true, uniqueness: true
end
