class CreateResumes < ActiveRecord::Migration
  def change
    create_table :resumes do |t|
      t.string :slug
      t.string :company

      t.timestamps
    end
  end
end