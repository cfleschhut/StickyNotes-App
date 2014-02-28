class NotesController < ApplicationController
  def index
    render json: Note.all
  end

  def show
    render json: Note.find(params[:id])
  end

  def create
    render json: Note.create(note_params)
  end

  private
    def note_params
      params.require(:note).permit(:title)
    end
end
