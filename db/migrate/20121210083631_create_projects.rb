class CreateProjects < ActiveRecord::Migration
  def change
    create_table :projects do |t|
      t.string :name
      t.string :link
      t.text :description
      t.date :released

      t.timestamps
    end
    add_index :projects, :name, :unique => true
  end
end
