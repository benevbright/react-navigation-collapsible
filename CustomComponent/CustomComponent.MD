#Custom Component
Is a solution to resolve problem with custom header
```JS
import { CustomComponent } from 'react-navigation-collapsible';

//My Component
const MyComponent = (props) => (<Text>MyComponent</Text>);

// USE
class Settings extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
          header: prop => ( // This didn't workout
            <CustomComponent {...prop}>
              <MyComponent/>
            </CustomComponent>
          ),
        };
      };
...
```
