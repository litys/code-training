<template>
  <div class="grid">
    
    <table>
      <tr v-for="(row, index_row) in grid" :key="index_row">
        <td v-for="(numbers, index) in row" :key="index"> 
          <input
           v-model="grid[index_row][index]"
           @click="$event.target.select()"
           @keypress="onlyNumber($event)"
           @click.right="handleRightClick"
          > 
        </td>
      </tr>
    </table>

    <div class="options text-center mt-2 mb-4">

      <v-btn
        depressed
        color="primary"
        @click="calculate()"
      >
        Solve
      </v-btn>

      <h3>On right click you can mark numbers</h3>
      <h4>This mini app helps you see how many "100%" moves you have</h4>

    </div>


    <v-dialog
      v-model="dialog"
      width="600px"
    >
      <v-card>
        <v-card-title>
          <span class="text-h5">Movement possibilities</span>
        </v-card-title>
        <v-card-text>
          
          <table>
            <tr v-for="(row, index_row) in new_grid" :key="index_row">
              <td v-for="(numbers, index) in row" :key="index"> 
                <input
                  v-model="new_grid[index_row][index]"
                  readonly
                  :class="new_grid[index_row][index] == grid[index_row][index] ? 'num_exist' : new_grid[index_row][index].search(',') != -1 ? 'num_multi':'num_new'"
                > 
              </td>
            </tr>
          </table>

        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="green darken-1"
            text
            @click="dialog = false"
          >
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </div>
</template>

<script>
  export default {
    name: 'Grid',

    data: () => ({
      dialog: false,
      grid: [
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
      ],
      new_grid: [],
    }),

    methods: {
      onlyNumber(evt) {
        evt = (evt) ? evt : window.event;
        var charCode = (evt.which) ? evt.which : evt.keyCode;
        if ( charCode < 48 || charCode > 57 ) {
          evt.preventDefault();
        } else {
          return true;
        }
      },
      handleRightClick(e){
        e.preventDefault();
        if ( e.target.className == 'locked' ) {
          e.target.className = '';
        } else {
          e.target.className = 'locked';
        }
      },
      calculate() {
        // Convert text to numbers in grid
        for ( const index in this.grid ) {
          this.grid[index] = this.grid[index].map( (n) => { 
            return parseInt(n); 
          });
        }

        // Calculating row
        this.new_grid = [];

        for ( const row_index in this.grid ) {
          var new_row = JSON.parse(JSON.stringify(this.grid[row_index])); // Copy array without reference
          for ( let i=1; i<10; i++) {
            if ( !this.grid[row_index].includes(i) ) {
              // There is no number in the row

              // Add that number to clear input (0)
              for ( const pos_in_row in new_row) {

                // Check if there is that number in the 3x3 grid
                const numbers_in_grid = this.getNumbersInGrid(row_index,pos_in_row);
                // Check if there is that number in the column
                const numbers_in_column = this.getNumbersInColumn(pos_in_row);

                if ( !numbers_in_grid.includes(i) && !numbers_in_column.includes(i) ) {

                  var number = new_row[pos_in_row].toString();
      
                  if ( number.search('0') != -1 ){
                    new_row[pos_in_row] = i + ',';
                  }
                  else if ( number.search(',') != -1 ) {
                    new_row[pos_in_row] += i + ',';
                  }

                }

              }

            }
          }
          this.new_grid.push(new_row);
        }

        this.deleteCommas();
        this.dialog = true;

      },

      getNumbersInGrid(row,position_in_row){
        // Row 1,2,3
        if (row < 3 ) {
          // 1-1 Grid
          if (position_in_row < 3) {
            const mesh = [
              this.grid[0][0],this.grid[0][1],this.grid[0][2],
              this.grid[1][0],this.grid[1][1],this.grid[1][2],
              this.grid[2][0],this.grid[2][1],this.grid[2][2]
            ];
            return mesh;
          }
          // 1-2 Grid
          else if (position_in_row >= 3 && position_in_row < 6) {
            const mesh = [
              this.grid[0][3],this.grid[0][4],this.grid[0][5],
              this.grid[1][3],this.grid[1][4],this.grid[1][5],
              this.grid[2][3],this.grid[2][4],this.grid[2][5]
            ];
            return mesh;
          }
          // 1-3 Grid
          else {
            const mesh = [
              this.grid[0][6],this.grid[0][7],this.grid[0][8],
              this.grid[1][6],this.grid[1][7],this.grid[1][8],
              this.grid[2][6],this.grid[2][7],this.grid[2][8]
            ];
            return mesh;
          }
        }
        // Row 4,5,6
        else if ( row >= 3 && row < 6) {
          // 2-1 Grid
          if (position_in_row < 3) {
            const mesh = [
              this.grid[3][0],this.grid[3][1],this.grid[3][2],
              this.grid[4][0],this.grid[4][1],this.grid[4][2],
              this.grid[5][0],this.grid[5][1],this.grid[5][2]
            ];
            return mesh;
          }
          // 2-2 Grid
          else if (position_in_row >= 3 && position_in_row < 6) {
            const mesh = [
              this.grid[3][3],this.grid[3][4],this.grid[3][5],
              this.grid[4][3],this.grid[4][4],this.grid[4][5],
              this.grid[5][3],this.grid[5][4],this.grid[5][5]
            ];
            return mesh;
          }
          // 2-3 Grid
          else {
            const mesh = [
              this.grid[3][6],this.grid[3][7],this.grid[3][8],
              this.grid[4][6],this.grid[4][7],this.grid[4][8],
              this.grid[5][6],this.grid[5][7],this.grid[5][8]
            ];
            return mesh;
          }
        }
        // Row 7,8,9
        else {
          // 3-1 Grid
          if (position_in_row < 3) {
            const mesh = [
              this.grid[6][0],this.grid[6][1],this.grid[6][2],
              this.grid[7][0],this.grid[7][1],this.grid[7][2],
              this.grid[8][0],this.grid[8][1],this.grid[8][2]
            ];
            return mesh;
          }
          // 3-2 Grid
          else if (position_in_row >= 3 && position_in_row < 6) {
            const mesh = [
              this.grid[6][3],this.grid[6][4],this.grid[6][5],
              this.grid[7][3],this.grid[7][4],this.grid[7][5],
              this.grid[8][3],this.grid[8][4],this.grid[8][5]
            ];
            return mesh;
          }
          // 3-3 Grid
          else {
            const mesh = [
              this.grid[6][6],this.grid[6][7],this.grid[6][8],
              this.grid[7][6],this.grid[7][7],this.grid[7][8],
              this.grid[8][6],this.grid[8][7],this.grid[8][8]
            ];
            return mesh;
          }
        }
      },

      getNumbersInColumn(position_in_row){
        return [ 
          this.grid[0][position_in_row],
          this.grid[1][position_in_row],
          this.grid[2][position_in_row],
          this.grid[3][position_in_row],
          this.grid[4][position_in_row],
          this.grid[5][position_in_row],
          this.grid[6][position_in_row],
          this.grid[7][position_in_row],
          this.grid[8][position_in_row]
        ]
      },

      deleteCommas(){
        for ( const row in this.new_grid ) {
          for ( const row_number in this.new_grid[row] ) {
            if ( this.new_grid[row][row_number].toString().search(',') != -1 ) {
              this.new_grid[row][row_number] = this.new_grid[row][row_number].toString().slice(0,-1);
            }
          }
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
$grid1: rgb(255, 152, 152);
$grid2: rgb(255, 202, 152);
$grid3: rgb(255, 236, 152);
$grid4: rgb(202, 255, 152);
$grid5: rgb(152, 255, 216);
$grid6: rgb(152, 193, 255);
$grid7: rgb(179, 152, 255);
$grid8: rgb(200, 152, 255);
$grid9: rgb(255, 152, 255);

table {
  margin: auto;
}
input {
  width: 45px;
  height: 45px;
  border: 1px solid black;
  text-align: center;
}

// Grid colors
tr:nth-child(n+1):nth-child(-n+3) {
  td:nth-child(n+1):nth-child(-n+3){
    background: $grid1;
  }
  td:nth-child(n+4):nth-child(-n+6){
    background: $grid2;
  }
  td:nth-child(n+7):nth-child(-n+9){
    background: $grid3;
  }
}
tr:nth-child(n+4):nth-child(-n+6) {
  td:nth-child(n+1):nth-child(-n+3){
    background: $grid4;
  }
  td:nth-child(n+4):nth-child(-n+6){
    background: $grid5;
  }
  td:nth-child(n+7):nth-child(-n+9){
    background: $grid6;
  }
}
tr:nth-child(n+7):nth-child(-n+9) {
  td:nth-child(n+1):nth-child(-n+3){
    background: $grid7;
  }
  td:nth-child(n+4):nth-child(-n+6){
    background: $grid8;
  }
  td:nth-child(n+7):nth-child(-n+9){
    background: $grid9;
  }
}

.locked {
  background: black;
  color: white;
}

// Numbers styling
.num_exist {
  background: red;
}
.num_multi {
  background: yellow;
}
.num_new {
  background: greenyellow;
}

</style>
