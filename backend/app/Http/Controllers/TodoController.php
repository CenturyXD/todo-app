<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Todo;
use App\Http\Requests\StoreTodoRequest;
use App\Http\Requests\UpdateTodoRequest;
use Exception;

class TodoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        return Todo::orderByDesc('id')->get();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTodoRequest $request)
    {
        //
        try{
            $validated = $request->validated();
            $todo = Todo::create($validated);
            return response()->json($todo, 201);
        }catch(Exception $e){
            return response()->json(['error' => 'Failed to create todo', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTodoRequest $request, string $id)
    {
        //
        $validated = $request->validated();
        $todo = Todo::findOrFail($id);
        $todo->update($validated);
        return response()->json($todo);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
        $todo = Todo::findOrFail($id);
        $todo->delete();
        return response()->json(null, 204);
    }

    public function toggle(string $id)
    {
        try{
            $todo = Todo::findOrFail($id);
            $todo->completed = !$todo->completed;
            $todo->save();
            return response()->json($todo);
        }catch(Exception $e){
            return response()->json(['error' => 'Failed to toggle todo', 'message' => $e->getMessage()], 500);
        }
    }
}
