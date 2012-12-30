class Project < ActiveRecord::Base
  attr_accessible :description, :link, :name, :released
end
