class GameController < ApplicationController
  def show
  	@scores = Score.limit(10)
  end
end
